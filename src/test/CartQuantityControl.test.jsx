import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CartQuantityControl from '../components/CartQuantityControl.jsx';

const props = { productId: 'GA001', productName: 'Guitarra acústica', quantity: 2, stock: 3 };

describe('CartQuantityControl', () => {
  it('solicita incremento y decremento mediante callbacks', () => {
    const onChange = vi.fn(() => null);
    render(<CartQuantityControl {...props} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /aumentar cantidad/i }));
    expect(onChange).toHaveBeenCalledWith('GA001', 3);
    fireEvent.click(screen.getByRole('button', { name: /disminuir cantidad/i }));
    expect(onChange).toHaveBeenCalledWith('GA001', 1);
  });
  it('rechaza una cantidad no entera sin enviar cambios', () => {
    const onChange = vi.fn();
    render(<CartQuantityControl {...props} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Cantidad de Guitarra acústica'), { target: { value: '2.5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/cantidad entera/i);
    expect(onChange).not.toHaveBeenCalled();
  });
  it('muestra el error de existencias indicado por la lógica', () => {
    const onChange = vi.fn(() => 'Solo hay 3 unidades disponibles.');
    render(<CartQuantityControl {...props} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('Cantidad de Guitarra acústica'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/solo hay 3 unidades/i);
  });
});
