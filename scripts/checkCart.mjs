import assert from 'node:assert/strict';
import { initialProducts } from '../src/data/products.js';
import { updateStock, deleteProduct } from '../src/services/productRepository.js';
import {
  cartStorageKey, readCart, saveCart, addToCart, setCartQuantity,
  removeFromCart, normalizeCart, cartSummary,
} from '../src/services/cartRepository.js';

const products = initialProducts;
const first = products[0];
assert.equal(products.length, 51, 'Se deben conservar las 51 fichas del Excel Forma B');
assert.equal(new Set(products.map(({ id }) => id)).size, 51);
let cart = addToCart([], first.id, products);
assert.equal(cart.error, null);
assert.deepEqual(cart.items, [{ productId: first.id, quantity: 1 }]);
cart = addToCart(cart.items, first.id, products, 2);
assert.equal(cart.items[0].quantity, 3);
assert.match(addToCart(cart.items, first.id, products, first.stock).error, /Solo hay/);
assert.match(addToCart([], 'NO-EXISTE', products).error, /no existe/);
assert.match(addToCart([], first.id, products, 0).error, /cantidad/);
assert.equal(setCartQuantity(cart.items, first.id, 2, products).items[0].quantity, 2);
assert.match(setCartQuantity(cart.items, first.id, first.stock + 1, products).error, /Solo hay/);
const summary = cartSummary(cart.items, products);
assert.equal(summary.subtotal, first.price * 3);
assert.equal(summary.count, 3);
assert.deepEqual(normalizeCart(cart.items, updateStock(products, first.id, 1).products), [{ productId: first.id, quantity: 1 }]);
assert.deepEqual(normalizeCart(cart.items, deleteProduct(products, first.id)), []);
assert.deepEqual(removeFromCart(cart.items, first.id), []);
const memory = new Map();
const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
saveCart('demo-cliente', cart.items, storage);
assert.deepEqual(readCart('demo-cliente', products, storage), cart.items);
assert.deepEqual(readCart('demo-administrador', products, storage), []);
assert.ok(memory.has(cartStorageKey('demo-cliente')));
console.log('OK: catálogo real de 51 productos, agregar, acumular, límite de stock, editar, quitar, subtotales, reconciliación y persistencia separada por usuario.');
