import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import UserForm from '../components/UserForm.jsx';
import { initialUsers } from '../services/userRepository.js';
import { ROLES } from '../utils/roles.js';
describe('Formulario de usuario', () => {
  it('no envía datos vacíos y muestra errores de validación', () => {
    const onSave = vi.fn();
    render(<UserForm existing={initialUsers} onSave={onSave} />);
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(screen.getByText(/nombre debe tener entre 3 y 80/i)).toBeInTheDocument();
    expect(screen.getByText(/correo electrónico válido/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
  it('envía un rol Cliente incluso cuando el registro es público', () => {
    const onSave = vi.fn(() => ({ error: null }));
    render(<UserForm publicRegistration existing={initialUsers} initial={{ name: '', email: '', phone: '', role: ROLES.ADMIN }} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Cliente Prueba' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'prueba@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ role: ROLES.CLIENTE }));
    expect(screen.queryByLabelText(/^rol/i)).not.toBeInTheDocument();
  });
  it('permite cambiar el rol desde el panel de administración', () => {
    const onSave = vi.fn(() => ({ error: null }));
    render(<UserForm existing={initialUsers} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Vendedor Prueba' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'vendedor2@example.com' } });
    fireEvent.change(screen.getByLabelText(/^rol/i), { target: { value: ROLES.VENDEDOR } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }));
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ role: ROLES.VENDEDOR }));
  });
});
