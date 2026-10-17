export const ROLES = Object.freeze({
  CLIENTE: 'cliente',
  VENDEDOR: 'vendedor',
  ADMIN: 'administrador',
});

export const ROLE_LABELS = Object.freeze({
  [ROLES.CLIENTE]: 'Cliente',
  [ROLES.VENDEDOR]: 'Vendedor',
  [ROLES.ADMIN]: 'Administrador',
});

export const DEMO_NAMES = Object.freeze({
  [ROLES.CLIENTE]: 'Cliente demo',
  [ROLES.VENDEDOR]: 'Vendedor demo',
  [ROLES.ADMIN]: 'Administrador demo',
});

export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

export function canAccessRole(role, allowedRoles) {
  return isValidRole(role) && (!allowedRoles || allowedRoles.includes(role));
}
