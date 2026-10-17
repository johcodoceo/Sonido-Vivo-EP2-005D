import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import UserManagementPage from '../pages/UserManagementPage.jsx';
import { useUsers } from '../context/UserContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { initialUsers } from '../services/userRepository.js';
vi.mock('../context/UserContext.jsx', () => ({ useUsers: vi.fn() }));
vi.mock('../context/AuthContext.jsx', () => ({ useAuth: vi.fn() }));
function setup() {
  vi.mocked(useUsers).mockReturnValue({ users: initialUsers, createAccount: vi.fn(), updateAccount: vi.fn(), toggleAccount: vi.fn().mockReturnValue({ error: null }), storageError: '' });
  vi.mocked(useAuth).mockReturnValue({ user: { id: 'demo-administrador', role: 'administrador' } });
  render(<UserManagementPage />);
}
describe('Administración de usuarios', () => {
  it('muestra los perfiles y filtra por rol', () => {
    setup();
    expect(screen.getByText('Cliente demo')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Filtrar por rol'), { target: { value: 'vendedor' } });
    expect(screen.queryByText('Cliente demo')).not.toBeInTheDocument();
    expect(screen.getByText('Vendedor demo')).toBeInTheDocument();
  });
  it('abre el formulario de alta y cancela sin guardar', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /crear usuario/i }));
    expect(screen.getByRole('heading', { name: /nuevo usuario/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByRole('heading', { name: /nuevo usuario/i })).not.toBeInTheDocument();
  });
  it('evita desactivar la cuenta del Administrador actual desde la interfaz', () => {
    setup();
    const row = screen.getByText('Administrador demo').closest('tr');
    expect(row.querySelector('button.btn-outline-danger')).toBeDisabled();
  });
});
