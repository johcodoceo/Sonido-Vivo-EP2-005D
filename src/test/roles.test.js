import { describe, expect, it } from 'vitest';
import { canAccessRole, isValidRole, ROLES } from '../utils/roles.js';

describe('roles del caso Sonido Vivo', () => {
  it('reconoce únicamente los roles definidos por el caso', () => {
    expect(isValidRole(ROLES.CLIENTE)).toBe(true);
    expect(isValidRole(ROLES.VENDEDOR)).toBe(true);
    expect(isValidRole('superusuario')).toBe(false);
  });

  it('impide que un vendedor acceda a rutas exclusivas del administrador', () => {
    expect(canAccessRole(ROLES.VENDEDOR, [ROLES.ADMIN])).toBe(false);
    expect(canAccessRole(ROLES.ADMIN, [ROLES.ADMIN])).toBe(true);
  });
});
