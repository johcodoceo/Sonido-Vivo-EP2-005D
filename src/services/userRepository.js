import { ROLES, isValidRole } from '../utils/roles.js';

/** Solo frontend académico: perfiles ficticios, SIN contraseñas ni autenticación segura. */
export const USERS_STORAGE_KEY = 'sonido-vivo-usuarios-forma-b-v1';
export const initialUsers = Object.freeze([
  { id: 'demo-cliente', name: 'Cliente demo', email: 'cliente@sonidovivo.example', phone: '', role: ROLES.CLIENTE, active: true, createdAt: '2026-10-01T00:00:00.000Z' },
  { id: 'demo-vendedor', name: 'Vendedor demo', email: 'vendedor@sonidovivo.example', phone: '', role: ROLES.VENDEDOR, active: true, createdAt: '2026-10-01T00:00:00.000Z' },
  { id: 'demo-administrador', name: 'Administrador demo', email: 'admin@sonidovivo.example', phone: '', role: ROLES.ADMIN, active: true, createdAt: '2026-10-01T00:00:00.000Z' },
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateUser(values, users = [], excludeId = null, { publicRegistration = false } = {}) {
  const name = String(values?.name ?? '').trim().replace(/\s+/g, ' ');
  const email = String(values?.email ?? '').trim().toLowerCase();
  const phone = String(values?.phone ?? '').trim();
  const role = publicRegistration ? ROLES.CLIENTE : values?.role;
  const errors = {};
  if (name.length < 3 || name.length > 80) errors.name = 'El nombre debe tener entre 3 y 80 caracteres.';
  if (email.length > 130 || !emailPattern.test(email)) errors.email = 'Ingresa un correo electrónico válido.';
  else if (users.some((person) => person.id !== excludeId && person.email.toLowerCase() === email)) errors.email = 'Ese correo ya está registrado.';
  if (phone && !/^\+?[0-9\s-]{8,20}$/.test(phone)) errors.phone = 'Usa entre 8 y 20 caracteres: números, espacios, + o guiones.';
  if (!isValidRole(role)) errors.role = 'Selecciona un rol válido.';
  return { errors, data: { name, email, phone, role } };
}

export function createUser(users, form, at = '2026-10-14T00:00:00.000Z', options = {}) {
  const { errors, data } = validateUser(form, users, null, options);
  if (Object.keys(errors).length) return { error: 'Revisa los datos del usuario.', errors, users };
  let suffix = users.length + 1;
  const stamp = new Date(at).getTime();
  if (!Number.isFinite(stamp)) return { error: 'Fecha inválida.', errors: {}, users };
  let id = `SVU-${stamp}-${suffix}`;
  while (users.some((entry) => entry.id === id)) id = `SVU-${stamp}-${++suffix}`;
  const user = { ...data, id, active: true, createdAt: at };
  return { error: null, errors: {}, user, users: [...users, user] };
}

export function editUser(users, id, form, actorId) {
  const previous = users.find((person) => person.id === id);
  if (!previous) return { error: 'Usuario no encontrado.', errors: {}, users };
  const { errors, data } = validateUser(form, users, id);
  if (Object.keys(errors).length) return { error: 'Revisa los datos del usuario.', errors, users };
  if (id === actorId && data.role !== previous.role) return { error: 'No puedes cambiar tu propio rol.', errors: {}, users };
  if (previous.active && previous.role === ROLES.ADMIN && data.role !== ROLES.ADMIN && activeAdminCount(users) <= 1) {
    return { error: 'Debe quedar al menos un Administrador activo.', errors: {}, users };
  }
  return { error: null, errors: {}, users: users.map((person) => person.id === id ? { ...person, ...data } : person) };
}

export function activeAdminCount(users) {
  return users.filter((person) => person.role === ROLES.ADMIN && person.active).length;
}

export function toggleUser(users, id, actorId) {
  const previous = users.find((person) => person.id === id);
  if (!previous) return { error: 'Usuario no encontrado.', users };
  if (actorId === id && previous.active) return { error: 'No puedes desactivar tu propia cuenta.', users };
  if (previous.active && previous.role === ROLES.ADMIN && activeAdminCount(users) <= 1) {
    return { error: 'Debe quedar al menos un Administrador activo.', users };
  }
  return { error: null, users: users.map((person) => person.id === id ? { ...person, active: !person.active } : person) };
}

function isStoredUser(person) {
  return !!person && typeof person.id === 'string' && person.id.length > 0 &&
    typeof person.name === 'string' && typeof person.email === 'string' &&
    typeof person.phone === 'string' && isValidRole(person.role) &&
    typeof person.active === 'boolean' && typeof person.createdAt === 'string';
}

export function readUsers(storage = globalThis.localStorage) {
  try {
    const raw = storage.getItem(USERS_STORAGE_KEY);
    if (raw === null) return initialUsers.map((item) => ({ ...item }));
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('Datos inválidos');
    const ids = new Set();
    const emails = new Set();
    const valid = parsed.every((person) => {
      if (!isStoredUser(person) || ids.has(person.id) || emails.has(person.email.toLowerCase())) return false;
      ids.add(person.id);
      emails.add(person.email.toLowerCase());
      return true;
    });
    // Si la copia local está dañada, usamos perfiles de ejemplo y no una lista parcial.
    return valid && activeAdminCount(parsed) >= 1 ? parsed : initialUsers.map((item) => ({ ...item }));
  } catch {
    return initialUsers.map((item) => ({ ...item }));
  }
}

export function saveUsers(users, storage = globalThis.localStorage) {
  storage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}
