import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ProductForm from '../components/ProductForm.jsx';

describe('ProductForm', () => {
  it('muestra mensajes claros cuando se intenta guardar vacío', () => {
    const save = vi.fn(() => ({}));
    render(<ProductForm products={[]} onSave={save} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /crear producto/i }));
    expect(screen.getByText(/nombre debe tener entre 3 y 110/i)).toBeInTheDocument();
    expect(save).not.toHaveBeenCalled();
  });
  it('entrega los datos validados al guardar formulario válido (spy)', () => {
    const save = vi.fn(() => ({}));
    render(<ProductForm products={[]} onSave={save} onCancel={() => {}} />);
    fireEvent.change(screen.getByLabelText(/nombre del producto/i), { target: { value: 'Guitarra demo' } });
    fireEvent.change(screen.getByLabelText(/^marca/i), { target: { value: 'Marca Demo' } });
    fireEvent.change(screen.getByLabelText(/^modelo/i), { target: { value: 'DemoX' } });
    fireEvent.change(screen.getByLabelText(/^precio en clp/i), { target: { value: '150000' } });
    fireEvent.change(screen.getByLabelText(/^existencias/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/^descripción/i), { target: { value: 'Guitarra para ensayo y práctica musical.' } });
    fireEvent.click(screen.getByRole('button', { name: /crear producto/i }));
    expect(save).toHaveBeenCalledWith(expect.objectContaining({ name:'Guitarra demo', price:150000, stock:2 }));
  });
});
