import { describe, expect, it } from 'vitest';
import { ROLES } from '../utils/roles.js';
import {
  USERS_STORAGE_KEY, createUser, editUser, initialUsers, readUsers,
  saveUsers, toggleUser, validateUser,
} from '../services/userRepository.js';
const at = '2026-10-14T16:00:00.000Z';
const input = { name: 'Persona de Prueba', email: 'persona@example.com', phone: '+56 9 1111 2222', role: ROLES.VENDEDOR };
function makeStore() {
  const map = new Map();
  return { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: (k) => map.delete(k) };
}
describe('usuarios simulados: registro y validaciones', () => {
  it('exige nombre correcto y correo bien formado', () => {
    expect(validateUser({ ...input, name: 'x', email: 'malo' }).errors).toEqual(expect.objectContaining({ name: expect.any(String), email: expect.any(String) }));
  });
  it('impide correos repetidos aun con mayúsculas', () => {
    const result = createUser(initialUsers, { ...input, email: 'ADMIN@sonidovivo.example' }, at);
    expect(result.errors.email).toMatch(/registrado/i);
  });
  it('registra únicamente clientes desde formulario público, aunque el usuario intente otro rol', () => {
    const result = createUser(initialUsers, input, at, { publicRegistration: true });
    expect(result.error).toBeNull();
    expect(result.user.role).toBe(ROLES.CLIENTE);
    expect(result.user.email).toBe('persona@example.com');
  });
  it('permite validar teléfonos opcionales pero rechaza caracteres inesperados', () => {
    expect(validateUser({ ...input, phone: '' }).errors.phone).toBeUndefined();
    expect(validateUser({ ...input, phone: 'abc' }).errors.phone).toBeTruthy();
  });
  it('crea un perfil, lo edita y detecta duplicados al actualizar', () => {
    const created = createUser(initialUsers, input, at);
    const changed = editUser(created.users, created.user.id, { ...input, name: 'Nombre Actualizado' }, 'demo-administrador');
    expect(changed.error).toBeNull();
    expect(changed.users.at(-1).name).toBe('Nombre Actualizado');
    expect(editUser(changed.users, created.user.id, { ...input, email: initialUsers[0].email }, 'demo-administrador').errors.email).toBeTruthy();
  });
  it('rechaza cambiar el propio rol y desactivar la propia cuenta', () => {
    const changed = editUser(initialUsers, 'demo-administrador', { ...initialUsers[2], role: ROLES.CLIENTE }, 'demo-administrador');
    expect(changed.error).toMatch(/propio/i);
    expect(toggleUser(initialUsers, 'demo-administrador', 'demo-administrador').error).toMatch(/propia/i);
  });
  it('evita quedarse sin administradores activos', () => {
    expect(toggleUser(initialUsers, 'demo-administrador', 'demo-cliente').error).toMatch(/al menos/i);
    expect(editUser(initialUsers, 'demo-administrador', { ...initialUsers[2], role: ROLES.VENDEDOR }, 'demo-cliente').error).toMatch(/al menos/i);
  });
  it('desactiva y reactiva un perfil que no sea el propio administrador', () => {
    const off = toggleUser(initialUsers, 'demo-vendedor', 'demo-administrador');
    expect(off.users[1].active).toBe(false);
    const on = toggleUser(off.users, 'demo-vendedor', 'demo-administrador');
    expect(on.users[1].active).toBe(true);
  });
  it('lee y guarda perfiles en localStorage simulado', () => {
    const store = makeStore();
    expect(readUsers(store)).toHaveLength(3);
    const created = createUser(initialUsers, input, at);
    saveUsers(created.users, store);
    expect(JSON.parse(store.getItem(USERS_STORAGE_KEY))).toHaveLength(4);
    expect(readUsers(store).at(-1).id).toBe(created.user.id);
  });
  it('usa las cuentas iniciales si el almacenamiento está corrupto', () => {
    const store = makeStore();
    store.setItem(USERS_STORAGE_KEY, '{invalido');
    expect(readUsers(store).map((person) => person.id)).toEqual(initialUsers.map((person) => person.id));
  });
});
