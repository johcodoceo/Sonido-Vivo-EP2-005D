import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useUsers } from '../context/UserContext.jsx';
import { initialUsers } from '../services/userRepository.js';
import { ROLES } from '../utils/roles.js';

vi.mock('../context/AuthContext.jsx', () => ({ useAuth: vi.fn() }));
vi.mock('../context/UserContext.jsx', () => ({ useUsers: vi.fn() }));

function view(users = initialUsers, loginDemo = vi.fn()) {
  vi.mocked(useUsers).mockReturnValue({ users });
  vi.mocked(useAuth).mockReturnValue({ user: null, loginDemo, loginProfile: vi.fn() });
  render(<MemoryRouter initialEntries={['/ingresar']}>
    <Routes><Route path="/ingresar" element={<LoginPage />} /><Route path="/inicio" element={<h1>Inicio de prueba</h1>} /></Routes>
  </MemoryRouter>);
  return loginDemo;
}

describe('Acceso simulado por perfiles', () => {
  it('ingresa como Cliente mediante una acción explícita', () => {
    const loginDemo = view();
    fireEvent.click(screen.getByRole('button', { name: /entrar como cliente/i }));
    expect(loginDemo).toHaveBeenCalledWith(ROLES.CLIENTE);
    expect(screen.getByRole('heading', { name: 'Inicio de prueba' })).toBeInTheDocument();
  });
  it('no permite usar un perfil desactivado', () => {
    const users = initialUsers.map((person) => person.id === 'demo-vendedor' ? { ...person, active: false } : person);
    const loginDemo = view(users);
    expect(screen.getByRole('button', { name: /entrar como vendedor/i })).toBeDisabled();
    expect(loginDemo).not.toHaveBeenCalled();
  });
  it('muestra error de un acceso fallido sin redirigir', () => {
    const loginDemo = vi.fn(() => { throw new Error('Perfil no disponible'); });
    view(initialUsers, loginDemo);
    fireEvent.click(screen.getByRole('button', { name: /entrar como cliente/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Perfil no disponible');
    expect(screen.getByRole('heading', { name: /explora el proyecto/i })).toBeInTheDocument();
  });
});
