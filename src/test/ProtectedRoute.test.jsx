import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../utils/roles.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

vi.mock('../context/AuthContext.jsx', () => ({ useAuth: vi.fn() }));

function renderProtected() {
  render(
    <MemoryRouter initialEntries={['/administracion']}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/administracion" element={<h1>Panel interno</h1>} />
        </Route>
        <Route path="/ingresar" element={<h1>Acceso de prueba</h1>} />
        <Route path="/sin-acceso" element={<h1>Acceso restringido</h1>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('redirige a ingresar cuando no hay sesión', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null });
    renderProtected();
    expect(screen.getByRole('heading', { name: 'Acceso de prueba' })).toBeInTheDocument();
  });

  it('bloquea el acceso visual a un usuario con rol vendedor', () => {
    vi.mocked(useAuth).mockReturnValue({ user: { role: ROLES.VENDEDOR } });
    renderProtected();
    expect(screen.getByRole('heading', { name: 'Acceso restringido' })).toBeInTheDocument();
  });

  it('permite acceder al usuario con rol administrador', () => {
    vi.mocked(useAuth).mockReturnValue({ user: { role: ROLES.ADMIN } });
    renderProtected();
    expect(screen.getByRole('heading', { name: 'Panel interno' })).toBeInTheDocument();
  });
});
