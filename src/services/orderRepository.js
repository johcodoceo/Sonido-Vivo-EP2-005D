/** Pedidos académicos locales: NO existen cobros, envíos ni transacciones reales. */
import { PRODUCTS_STORAGE_KEY, readProducts } from './productRepository.js';
import { cartStorageKey, normalizeCart, sameCart } from './cartRepository.js';

export const ORDERS_STORAGE_KEY = 'sonido-vivo-pedidos-forma-b-v1';
export const FULFILLMENT = Object.freeze({ DELIVERY: 'despacho', PICKUP: 'retiro' });
export const ORDER_STATUS = Object.freeze({ PREPARING: 'preparacion', SHIPPED: 'despachado', READY: 'listo-retiro', DELIVERED: 'entregado' });
export const STATUS_NAMES = Object.freeze({
  [ORDER_STATUS.PREPARING]: 'En preparación',
  [ORDER_STATUS.SHIPPED]: 'Despachado',
  [ORDER_STATUS.READY]: 'Listo para retiro',
  [ORDER_STATUS.DELIVERED]: 'Entregado',
});
export const FULFILLMENT_NAMES = Object.freeze({ despacho: 'Despacho a domicilio', retiro: 'Retiro en tienda' });

export function validateCheckout(form) {
  const errors = {};
  const name = String(form?.name ?? '').trim();
  const email = String(form?.email ?? '').trim();
  const fulfillment = form?.fulfillment;
  const city = String(form?.city ?? '').trim();
  const address = String(form?.address ?? '').trim();
  const notes = String(form?.notes ?? '').trim();
  if (name.length < 3 || name.length > 80) errors.name = 'Ingresa un nombre de 3 a 80 caracteres.';
  if (email.length > 130 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Ingresa un correo válido.';
  if (![FULFILLMENT.DELIVERY, FULFILLMENT.PICKUP].includes(fulfillment)) errors.fulfillment = 'Selecciona despacho o retiro.';
  if (fulfillment === FULFILLMENT.DELIVERY) {
    if (city.length < 2 || city.length > 80) errors.city = 'Ingresa una ciudad de 2 a 80 caracteres.';
    if (address.length < 8 || address.length > 150) errors.address = 'Ingresa una dirección de 8 a 150 caracteres.';
  }
  if (notes.length > 250) errors.notes = 'El comentario no puede superar los 250 caracteres.';
  return { errors, data: { name, email, fulfillment, city: fulfillment === 'despacho' ? city : '', address: fulfillment === 'despacho' ? address : '', notes } };
}

export function createOrder(orders, items, products, userId, form, now = new Date().toISOString()) {
  const { errors, data } = validateCheckout(form);
  if (Object.keys(errors).length) return { error: 'Revisa los datos del formulario.', errors };
  if (!['demo-cliente', 'demo-administrador'].includes(userId)) return { error: 'Esta cuenta no puede hacer pedidos.', errors: {} };
  if (!Array.isArray(items) || items.length === 0) return { error: 'Tu carrito está vacío.', errors: {} };
  if (!Array.isArray(products) || !Array.isArray(orders)) return { error: 'No se pudo consultar el catálogo.', errors: {} };
  const byId = new Map(products.map((p) => [p.id, p]));
  const seen = new Set();
  const lines = [];
  for (const item of items) {
    if (!item || typeof item.productId !== 'string' || seen.has(item.productId) || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
      return { error: 'El carrito contiene cantidades inválidas.', errors: {} };
    }
    seen.add(item.productId);
    const product = byId.get(item.productId);
    if (!product) return { error: `El producto ${item.productId} ya no está en el catálogo.`, errors: {} };
    if (item.quantity > product.stock) return { error: `Stock insuficiente de ${product.name}. Disponible: ${product.stock}.`, errors: {} };
    if (!Number.isSafeInteger(product.price) || product.price < 0) return { error: 'Hay un precio inválido en el catálogo.', errors: {} };
    const total = item.quantity * product.price;
    if (!Number.isSafeInteger(total)) return { error: 'El monto del pedido es demasiado grande.', errors: {} };
    lines.push({ productId: product.id, name: product.name, brand: product.brand, model: product.model, quantity: item.quantity, unitPrice: product.price, lineTotal: total });
  }
  const totalProducts = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  if (!Number.isSafeInteger(totalProducts)) return { error: 'El monto del pedido es demasiado grande.', errors: {} };
  const timestamp = new Date(now).getTime();
  if (!Number.isFinite(timestamp)) return { error: 'Fecha del pedido inválida.', errors: {} };
  const sequence = orders.length + 1;
  let id = `SVP-${timestamp}-${String(sequence).padStart(3, '0')}`;
  let attempt = sequence;
  while (orders.some((o) => o.id === id)) id = `SVP-${timestamp}-${String(++attempt).padStart(3, '0')}`;
  const order = {
    id, userId, createdAt: now, status: ORDER_STATUS.PREPARING,
    statusHistory: [{ status: ORDER_STATUS.PREPARING, at: now }],
    fulfillment: data.fulfillment, contact: { name: data.name, email: data.email },
    destination: { city: data.city, address: data.address }, notes: data.notes,
    lines, totalProducts, paymentStatus: 'sin-pago-simulado',
  };
  const decrements = new Map(lines.map(({ productId, quantity }) => [productId, quantity]));
  const updatedProducts = products.map((p) => decrements.has(p.id) ? { ...p, stock: p.stock - decrements.get(p.id) } : p);
  return { order, updatedOrders: [...orders, order], updatedProducts, errors: {}, error: null };
}

export function readOrders(storage = globalThis.localStorage) {
  try {
    const parsed = JSON.parse(storage.getItem(ORDERS_STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((order) => order && typeof order.id === 'string' &&
      typeof order.userId === 'string' && typeof order.createdAt === 'string' &&
      Object.values(ORDER_STATUS).includes(order.status) && Array.isArray(order.lines) &&
      Number.isSafeInteger(order.totalProducts) && order.totalProducts >= 0 &&
      order.contact && typeof order.contact.name === 'string' &&
      Object.values(FULFILLMENT).includes(order.fulfillment) &&
      Array.isArray(order.statusHistory));
  } catch { return []; }
}

export function nextStatuses(order) {
  if (!order) return [];
  if (order.status === ORDER_STATUS.PREPARING) return [order.fulfillment === FULFILLMENT.DELIVERY ? ORDER_STATUS.SHIPPED : ORDER_STATUS.READY];
  if (order.status === ORDER_STATUS.SHIPPED || order.status === ORDER_STATUS.READY) return [ORDER_STATUS.DELIVERED];
  return [];
}

export function transitionOrder(orders, id, status, at = new Date().toISOString()) {
  const found = orders.find((order) => order.id === id);
  if (!found) return { error: 'Pedido no encontrado.', orders };
  if (!nextStatuses(found).includes(status)) return { error: 'Ese cambio de estado no está permitido.', orders };
  const updated = orders.map((order) => order.id === id ? {
    ...order, status, statusHistory: [...order.statusHistory, { status, at }],
  } : order);
  return { error: null, orders: updated };
}

/** Escritura local de 3 claves con reversión best-effort; no reemplaza una transacción de backend.
 * El carrito se relee antes de confirmar para no aceptar una versión obsoleta del mismo navegador.
 */
export function commitDemoOrder(userId, cartItems, form, storage = globalThis.localStorage, now = new Date().toISOString()) {
  const keys = [PRODUCTS_STORAGE_KEY, ORDERS_STORAGE_KEY, cartStorageKey(userId)];
  try {
    const products = readProducts(storage);
    const orders = readOrders(storage);
    const storedCartRaw = storage.getItem(keys[2]);
    const storedCart = normalizeCart(storedCartRaw ? JSON.parse(storedCartRaw) : [], products);
    if (!sameCart(storedCart, cartItems)) return { error: 'El carrito cambió. Actualiza la página y revisa tus productos.', errors: {} };
    const result = createOrder(orders, storedCart, products, userId, form, now);
    if (result.error) return result;
    const originals = keys.map((key) => storage.getItem(key));
    try {
      storage.setItem(keys[0], JSON.stringify(result.updatedProducts));
      storage.setItem(keys[1], JSON.stringify(result.updatedOrders));
      storage.setItem(keys[2], JSON.stringify([]));
    } catch {
      keys.forEach((key, i) => {
        try { if (originals[i] === null) storage.removeItem(key); else storage.setItem(key, originals[i]); } catch { /* posible falla de almacenamiento */ }
      });
      return { error: 'No se pudo guardar el pedido. No se confirmó la operación.', errors: {} };
    }
    return result;
  } catch {
    return { error: 'No pudimos acceder al almacenamiento local. Comprueba la configuración de tu navegador.', errors: {} };
  }
}

export function commitStatusTransition(id, next, storage = globalThis.localStorage, at = new Date().toISOString()) {
  try {
    const result = transitionOrder(readOrders(storage), id, next, at);
    if (result.error) return result;
    storage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(result.orders));
    return result;
  } catch {
    return { error: 'No se pudo guardar el nuevo estado del pedido.' };
  }
}
