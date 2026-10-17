import assert from 'node:assert/strict';
import { ROLES } from '../src/utils/roles.js';
import {
  USERS_STORAGE_KEY, activeAdminCount, createUser, editUser, initialUsers,
  readUsers, saveUsers, toggleUser, validateUser,
} from '../src/services/userRepository.js';
import { createOrder } from '../src/services/orderRepository.js';
import { initialProducts } from '../src/data/products.js';

const memory = new Map();
const store = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => { memory.set(key, value); }, removeItem: (key) => memory.delete(key) };
const example = { name: 'Cliente Prueba', email: 'NUEVO@example.com', phone: '+56 9 1111 2222', role: ROLES.VENDEDOR };
const now = '2026-10-14T18:00:00.000Z';
assert.equal(readUsers(store).length, 3);
assert.equal(activeAdminCount(initialUsers), 1);
assert.ok(validateUser({ ...example, email: 'malo' }).errors.email);
let result = createUser(readUsers(store), example, now, { publicRegistration: true });
assert.equal(result.error, null);
assert.equal(result.user.role, ROLES.CLIENTE);
assert.equal(result.user.email, 'nuevo@example.com');
let users = result.users;
assert.ok(validateUser(example, users).errors.email);
saveUsers(users, store);
assert.equal(JSON.parse(memory.get(USERS_STORAGE_KEY)).length, 4);
assert.equal(readUsers(store).length, 4);
assert.equal(toggleUser(users, 'demo-administrador', 'demo-administrador').error.includes('propia'), true);
assert.equal(toggleUser(users, 'demo-administrador', 'demo-cliente').error.includes('al menos'), true);
assert.equal(editUser(users, 'demo-administrador', { ...users[2], role: ROLES.VENDEDOR }, 'demo-administrador').error.includes('propio'), true);
assert.equal(editUser(users, 'demo-administrador', { ...users[2], role: ROLES.VENDEDOR }, 'demo-cliente').error.includes('al menos'), true);
result = editUser(users, result.user.id, { name: 'Cliente Actualizado', email: 'nuevo@example.com', phone: '', role: ROLES.VENDEDOR }, 'demo-administrador');
assert.equal(result.error, null);
users = result.users;
assert.equal(users.find((person) => person.id === result.users[3].id).role, ROLES.VENDEDOR);
result = toggleUser(users, result.users[3].id, 'demo-administrador');
assert.equal(result.error, null);
assert.equal(result.users[3].active, false);
assert.equal(toggleUser(result.users, result.users[3].id, 'demo-administrador').users[3].active, true);
const form = { name: 'Cliente Ficticio', email: 'cliente@example.com', fulfillment: 'retiro', city: '', address: '', notes: '' };
const checkout = createOrder([], [{ productId: initialProducts[0].id, quantity: 1 }], initialProducts, result.users[3].id, form, now, ROLES.CLIENTE);
assert.equal(checkout.error, null, 'Usuarios de prueba nuevos pueden generar pedidos como Cliente');
assert.match(createOrder([], [{ productId: initialProducts[0].id, quantity: 1 }], initialProducts, result.users[3].id, form, now, ROLES.VENDEDOR).error, /no puede/);
console.log('OK — perfiles, validaciones, correo único, registro, CRUD, roles, bloqueo de último admin, persistencia y compatibilidad de pedidos.');
