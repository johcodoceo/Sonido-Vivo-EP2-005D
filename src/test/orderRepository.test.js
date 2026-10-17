import { describe, expect, it } from 'vitest';
import { initialProducts } from '../data/products.js';
import { cartStorageKey } from '../services/cartRepository.js';
import { PRODUCTS_STORAGE_KEY } from '../services/productRepository.js';
import {
  ORDERS_STORAGE_KEY, ORDER_STATUS, commitDemoOrder, commitStatusTransition,
  createOrder, nextStatuses, readOrders, transitionOrder, validateCheckout,
} from '../services/orderRepository.js';

const now = '2026-10-14T14:00:00.000Z';
const pickup = { name: 'Cliente Ejemplo', email: 'demo@example.com', fulfillment: 'retiro', city: '', address: '', notes: '' };
const delivery = { ...pickup, fulfillment: 'despacho', city: 'Valparaíso', address: 'Av. Ejemplo 1234' };
const product = initialProducts[0];
const cart = [{ productId: product.id, quantity: 2 }];
function memoryStore() {
  const map = new Map();
  return {
    getItem: (key) => map.has(key) ? map.get(key) : null,
    setItem: (key, value) => { map.set(key, value); },
    removeItem: (key) => { map.delete(key); },
  };
}

describe('validar datos del pedido', () => {
  it('requiere nombre y correo válido', () => {
    const { errors } = validateCheckout({ ...pickup, name: 'A', email: 'correo-malo' });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
  });
  it('requiere dirección y ciudad solo cuando hay despacho', () => {
    expect(validateCheckout({ ...pickup, fulfillment: 'despacho' }).errors.address).toBeTruthy();
    expect(validateCheckout(pickup).errors).toEqual({});
  });
  it('no conserva dirección innecesaria en retiro', () => {
    const result = validateCheckout({ ...pickup, city: 'Secreto', address: 'Dirección no requerida' });
    expect(result.data.city).toBe('');
    expect(result.data.address).toBe('');
  });
  it('rechaza observaciones excesivas', () => {
    expect(validateCheckout({ ...pickup, notes: 'a'.repeat(251) }).errors.notes).toBeTruthy();
  });
});

describe('pedidos, inventario y seguimiento', () => {
  it('registra copia de precios, cantidades y descuenta stock de productos', () => {
    const result = createOrder([], cart, initialProducts, 'demo-cliente', delivery, now);
    expect(result.error).toBeNull();
    expect(result.order.totalProducts).toBe(2 * product.price);
    expect(result.order.lines[0].unitPrice).toBe(product.price);
    expect(result.updatedProducts[0].stock).toBe(product.stock - 2);
    expect(initialProducts[0].stock).toBe(product.stock);
    expect(result.order.status).toBe(ORDER_STATUS.PREPARING);
  });
  it('impide pedido vacío, cantidades inválidas y stock insuficiente', () => {
    expect(createOrder([], [], initialProducts, 'demo-cliente', pickup, now).error).toMatch(/vacío/i);
    expect(createOrder([], [{ productId: product.id, quantity: 0 }], initialProducts, 'demo-cliente', pickup, now).error).toMatch(/inválidas/i);
    expect(createOrder([], [{ productId: product.id, quantity: product.stock + 1 }], initialProducts, 'demo-cliente', pickup, now).error).toMatch(/stock/i);
  });
  it('evita duplicar referencias del mismo producto y rechaza cuentas no clientes', () => {
    expect(createOrder([], [...cart, ...cart], initialProducts, 'demo-cliente', pickup, now).error).toMatch(/inválidas/i);
    expect(createOrder([], cart, initialProducts, 'demo-vendedor', pickup, now).error).toMatch(/no puede/i);
  });
  it('secuencia de estados para despacho y retiro', () => {
    const d = createOrder([], cart, initialProducts, 'demo-cliente', delivery, now).order;
    const r = createOrder([], cart, initialProducts, 'demo-cliente', pickup, now).order;
    expect(nextStatuses(d)).toEqual([ORDER_STATUS.SHIPPED]);
    expect(nextStatuses(r)).toEqual([ORDER_STATUS.READY]);
    expect(transitionOrder([d], d.id, ORDER_STATUS.DELIVERED).error).toMatch(/no está permitido/i);
    const shipped = transitionOrder([d], d.id, ORDER_STATUS.SHIPPED, now).orders[0];
    expect(nextStatuses(shipped)).toEqual([ORDER_STATUS.DELIVERED]);
    const delivered = transitionOrder([shipped], d.id, ORDER_STATUS.DELIVERED, now).orders[0];
    expect(nextStatuses(delivered)).toEqual([]);
    expect(delivered.statusHistory).toHaveLength(3);
  });
  it('id del pedido único cuando se repite el mismo instante', () => {
    const first = createOrder([], cart, initialProducts, 'demo-cliente', pickup, now);
    const second = createOrder([first.order], cart, initialProducts, 'demo-cliente', pickup, now);
    expect(second.order.id).not.toBe(first.order.id);
  });
  it('confirmación guarda pedido, descuenta stock y vacía carrito de forma persistente', () => {
    const store = memoryStore();
    store.setItem(cartStorageKey('demo-cliente'), JSON.stringify(cart));
    const result = commitDemoOrder('demo-cliente', cart, pickup, store, now);
    expect(result.error).toBeNull();
    expect(readOrders(store)).toHaveLength(1);
    expect(JSON.parse(store.getItem(PRODUCTS_STORAGE_KEY))[0].stock).toBe(product.stock - 2);
    expect(JSON.parse(store.getItem(cartStorageKey('demo-cliente')))).toEqual([]);
    const status = commitStatusTransition(result.order.id, ORDER_STATUS.READY, store, now);
    expect(status.error).toBeNull();
    expect(readOrders(store)[0].status).toBe(ORDER_STATUS.READY);
  });
  it('rechaza un carrito desactualizado y no crea pedidos', () => {
    const store = memoryStore();
    store.setItem(cartStorageKey('demo-cliente'), JSON.stringify(cart));
    expect(commitDemoOrder('demo-cliente', [{ productId: product.id, quantity: 1 }], pickup, store, now).error).toMatch(/cambió/i);
    expect(readOrders(store)).toHaveLength(0);
  });
  it('no confirma pedido cuando falla guardar; intenta restaurar las tres claves', () => {
    const store = memoryStore();
    store.setItem(cartStorageKey('demo-cliente'), JSON.stringify(cart));
    const original = store.setItem;
    store.setItem = (key, value) => {
      if (key === ORDERS_STORAGE_KEY) throw new Error('Cuota agotada');
      original(key, value);
    };
    const result = commitDemoOrder('demo-cliente', cart, pickup, store, now);
    expect(result.error).toMatch(/no se pudo guardar/i);
    expect(store.getItem(PRODUCTS_STORAGE_KEY)).toBe(null);
    expect(readOrders(store)).toEqual([]);
    expect(JSON.parse(store.getItem(cartStorageKey('demo-cliente')))).toEqual(cart);
  });
  it('impide descontar de nuevo si el stock ya fue consumido', () => {
    const store = memoryStore();
    store.setItem(cartStorageKey('demo-cliente'), JSON.stringify([{ productId: product.id, quantity: product.stock }]));
    const order = commitDemoOrder('demo-cliente', [{ productId: product.id, quantity: product.stock }], pickup, store, now);
    expect(order.error).toBeNull();
    // Stock cero implica que la nueva selección se normaliza a vacío y se rechaza.
    store.setItem(cartStorageKey('demo-cliente'), JSON.stringify([{ productId: product.id, quantity: 1 }]));
    expect(commitDemoOrder('demo-cliente', [{ productId: product.id, quantity: 1 }], pickup, store, now).error).toMatch(/cambió/i);
    expect(readOrders(store)).toHaveLength(1);
  });
});

describe('compatibilidad de pedidos con nuevos perfiles de etapa 5', () => {
  it('permite al perfil Cliente registrado comprar al recibir rol validado desde AuthContext', () => {
    const result = createOrder([], cart, initialProducts, 'SVU-1790000000-4', pickup, now, 'cliente');
    expect(result.error).toBeNull();
    expect(result.order.userId).toBe('SVU-1790000000-4');
  });
  it('no permite a un perfil de Vendedor registrado emitir pedidos y exige rol para IDs nuevos', () => {
    expect(createOrder([], cart, initialProducts, 'SVU-1790000000-4', pickup, now, 'vendedor').error).toMatch(/no puede/i);
    expect(createOrder([], cart, initialProducts, 'SVU-1790000000-4', pickup, now).error).toMatch(/no puede/i);
  });
});
