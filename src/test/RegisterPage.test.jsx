import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage.jsx';
import { useUsers } from '../context/UserContext.jsx';
import { initialUsers } from '../services/userRepository.js';
import { ROLES } from '../utils/roles.js';

vi.mock('../context/UserContext.jsx', () => ({ useUsers: vi.fn() }));
function view(registerClient = vi.fn(() => ({ error: null, user: { id: 'SVU-123' } })), storageError = '') {
  vi.mocked(useUsers).mockReturnValue({ users: initialUsers, registerClient, storageError });
  render(<MemoryRouter initialEntries={['/registro']}>
    <Routes><Route path="/registro" element={<RegisterPage />} /><Route path="/ingresar" element={<h1>Acceso posterior al registro</h1>} /></Routes>
  </MemoryRouter>);
  return registerClient;
}

describe('Registro público de Cliente', () => {
  it('impide enviar un registro vacío', () => {
    const registerClient = view();
    fireEvent.click(screen.getByRole('button', { name: /crear perfil cliente/i }));
    expect(registerClient).not.toHaveBeenCalled();
    expect(screen.getByText(/nombre debe tener entre 3 y 80/i)).toBeInTheDocument();
  });
  it('registra únicamente rol Cliente y redirige al acceso', () => {
    const registerClient = view();
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Cliente Nuevo' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'nuevo@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /crear perfil cliente/i }));
    expect(registerClient).toHaveBeenCalledWith(expect.objectContaining({ role: ROLES.CLIENTE }));
    expect(screen.getByRole('heading', { name: 'Acceso posterior al registro' })).toBeInTheDocument();
  });
  it('muestra error de almacenamiento sin simular registro exitoso', () => {
    view(undefined, 'Almacenamiento indisponible');
    expect(screen.getByRole('alert')).toHaveTextContent('Almacenamiento indisponible');
  });
});
