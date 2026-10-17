import assert from 'node:assert/strict';
import { initialProducts } from '../src/data/products.js';
import { categories } from '../src/data/categories.js';
import { isProduct, filterProducts, createProduct } from '../src/services/productRepository.js';

assert.equal(initialProducts.length, 51, 'Deben existir 51 fichas detalladas');
assert.equal(categories.length, 10, 'Deben existir 10 categorías');
assert.equal(categories.reduce((sum, item) => sum + item.referencesApprox, 0), 340, 'El total general de referencias del Excel debe ser 340');
assert.equal(new Set(initialProducts.map((item) => item.id)).size, 51, 'Los códigos del Excel deben ser únicos');
assert.ok(initialProducts.every(isProduct), 'Cada registro debe cumplir el esquema del frontend');
assert.equal(initialProducts[0].id, 'GA001');
assert.equal(initialProducts.at(-1).id, 'ES005');
assert.deepEqual(filterProducts(initialProducts, { query: 'F310' }).map((item) => item.id), ['GA001']);
assert.deepEqual(filterProducts(initialProducts, { query: 'MI001' }).map((item) => item.id), ['MI001']);
const created = createProduct(initialProducts, {
  name:'Instrumento de prueba', brand:'Marca de prueba', model:'PR-1', categorySlug: 'guitarras-acusticas',
  description:'Validación de un producto creado por administración.', price: 100000, stock: 2,
});
assert.deepEqual(created.errors, {});
assert.equal(created.products.at(-1).id, 'SV-001');
console.log('OK: 51 fichas, 10 categorías, 340 referencias totales declaradas, códigos únicos, búsqueda y CRUD básico.');
