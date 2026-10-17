import assert from 'node:assert/strict';
import { initialProducts } from '../src/data/products.js';
import { readCart, cartStorageKey, cartSummary } from '../src/services/cartRepository.js';
import { PRODUCTS_STORAGE_KEY, readProducts } from '../src/services/productRepository.js';
import { commitDemoOrder, commitStatusTransition, ORDER_STATUS, readOrders, validateCheckout } from '../src/services/orderRepository.js';

const storeMap = new Map();
const store = {
  getItem: (key) => storeMap.get(key) ?? null,
  setItem: (key, val) => storeMap.set(key, val),
  removeItem: (key) => storeMap.delete(key),
};
const userId = 'demo-cliente';
const product = initialProducts.find((p) => p.stock >= 2);
const cart = [{ productId: product.id, quantity: 2 }];
store.setItem(cartStorageKey(userId), JSON.stringify(cart));
assert.equal(initialProducts.length, 51);
assert.equal(validateCheckout({ name: 'Prueba', email: 'no', fulfillment: 'retiro' }).errors.email !== undefined, true);
const request = { name: 'Cliente de prueba', email: 'demo@example.com', fulfillment: 'retiro' };
const result = commitDemoOrder(userId, cart, request, store, '2026-10-14T14:00:00.000Z');
assert.equal(result.error, null);
assert.equal(readOrders(store).length, 1);
assert.equal(readProducts(store).find((p) => p.id === product.id).stock, product.stock - 2);
assert.deepEqual(readCart(userId, readProducts(store), store), []);
assert.deepEqual(cartSummary([], readProducts(store)).lines, []);
assert.equal(result.order.totalProducts, product.price * 2);
const status = commitStatusTransition(result.order.id, ORDER_STATUS.READY, store);
assert.equal(status.error, null);
assert.equal(commitStatusTransition(result.order.id, ORDER_STATUS.SHIPPED, store).error !== null, true);
assert.equal(commitStatusTransition(result.order.id, ORDER_STATUS.DELIVERED, store).error, null);
assert.equal(readOrders(store)[0].statusHistory.length, 3);
assert.equal(store.getItem(PRODUCTS_STORAGE_KEY) !== null, true);
console.log('OK: 51 productos, validaciones, confirmación, stock, carrito, persistencia, estados y seguimiento.');
