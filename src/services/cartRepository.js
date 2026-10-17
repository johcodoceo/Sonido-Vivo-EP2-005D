/** Carrito de demostración: se guardan solo códigos y cantidades, nunca precios.
 * Los datos vigentes (precio/stock/nombre) siempre proceden del catálogo.
 */
export const CART_STORAGE_PREFIX = 'sonido-vivo-carrito-forma-b-v1';

export function cartStorageKey(userId) {
  return `${CART_STORAGE_PREFIX}:${userId}`;
}

/** Descarta referencias obsoletas y ajusta cantidades al stock actualizado. */
export function normalizeCart(items, products) {
  if (!Array.isArray(items) || !Array.isArray(products)) return [];
  const index = new Map(products.map((product) => [product.id, product]));
  const quantities = new Map();
  for (const item of items) {
    if (!item || typeof item.productId !== 'string' ||
      !Number.isSafeInteger(item.quantity) || item.quantity < 1) continue;
    const product = index.get(item.productId);
    if (!product || !Number.isSafeInteger(product.stock) || product.stock <= 0) continue;
    const accumulated = quantities.get(item.productId) || 0;
    quantities.set(item.productId, Math.min(product.stock, accumulated + item.quantity));
  }
  return [...quantities.entries()].map(([productId, quantity]) => ({ productId, quantity }));
}

export function readCart(userId, products, storage) {
  if (!userId) return [];
  try {
    const target = storage ?? globalThis.localStorage;
    const raw = target.getItem(cartStorageKey(userId));
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    const adjusted = normalizeCart(parsed, products);
    // Al reabrir el carrito, corregir también el valor persistido si cambió
    // el stock o quedaron productos que ya no existen.
    if (!sameCart(parsed, adjusted)) {
      try { target.setItem(cartStorageKey(userId), JSON.stringify(adjusted)); }
      catch { /* Conservamos el carrito corregido en memoria */ }
    }
    return adjusted;
  } catch {
    return [];
  }
}

export function saveCart(userId, items, storage) {
  if (!userId) return;
  const target = storage ?? globalThis.localStorage;
  target.setItem(cartStorageKey(userId), JSON.stringify(items));
}

export function addToCart(items, productId, products, quantity = 1) {
  const product = products.find((p) => p.id === productId);
  if (!product) return { items, error: 'Este producto ya no existe en el catálogo.' };
  if (!Number.isSafeInteger(quantity) || quantity <= 0) {
    return { items, error: 'La cantidad debe ser un número entero mayor que cero.' };
  }
  if (product.stock <= 0) return { items, error: 'El producto está agotado.' };
  const existing = items.find((item) => item.productId === productId);
  const requested = (existing?.quantity || 0) + quantity;
  if (!Number.isSafeInteger(requested) || requested > product.stock) {
    return { items, error: `Solo hay ${product.stock} unidades disponibles de este producto.` };
  }
  return {
    items: existing
      ? items.map((item) => item.productId === productId ? { ...item, quantity: requested } : item)
      : [...items, { productId, quantity }],
    error: null,
  };
}

export function setCartQuantity(items, productId, quantity, products) {
  if (!Number.isSafeInteger(quantity) || quantity < 1) {
    return { items, error: 'La cantidad debe ser un número entero mayor que cero.' };
  }
  const product = products.find((p) => p.id === productId);
  if (!product) return { items, error: 'Este producto ya no existe en el catálogo.' };
  if (quantity > product.stock) {
    return { items, error: `Solo hay ${product.stock} unidades disponibles de este producto.` };
  }
  if (!items.some((item) => item.productId === productId)) {
    return { items, error: 'El producto no está en tu carrito.' };
  }
  return { items: items.map((item) => item.productId === productId ? { ...item, quantity } : item), error: null };
}

export function removeFromCart(items, productId) {
  return items.filter((item) => item.productId !== productId);
}

export function cartSummary(items, products) {
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = items.flatMap((item) => {
    const product = byId.get(item.productId);
    if (!product) return [];
    return [{ ...item, product, lineTotal: item.quantity * product.price }];
  });
  return {
    lines,
    count: lines.reduce((count, item) => count + item.quantity, 0),
    subtotal: lines.reduce((amount, item) => amount + item.lineTotal, 0),
  };
}

export function sameCart(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  return a.length === b.length && a.every((item, index) =>
    item.productId === b[index].productId && item.quantity === b[index].quantity);
}
