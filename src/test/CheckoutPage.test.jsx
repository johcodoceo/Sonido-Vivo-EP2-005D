import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { initialProducts } from '../data/products.js';
vi.mock('../context/CartContext.jsx', () => ({ useCart: vi.fn() }));
vi.mock('../context/OrderContext.jsx', () => ({ useOrders: vi.fn() }));
const product = initialProducts[0];
function setup() {
  vi.mocked(useCart).mockReturnValue({ lines: [{ productId: product.id, quantity: 1, product, lineTotal: product.price }], count: 1, subtotal: product.price, storageError: '', adjustmentNotice: '' });
  const placeOrder = vi.fn().mockReturnValue({ error: null, order: { id: 'TEST-1' } });
  vi.mocked(useOrders).mockReturnValue({ placeOrder });
  render(<MemoryRouter initialEntries={['/confirmar-pedido']}><Routes><Route path="/confirmar-pedido" element={<CheckoutPage />} /><Route path="/mis-pedidos" element={<div>Historial de prueba</div>} /></Routes></MemoryRouter>);
  return placeOrder;
}

describe('CheckoutPage', () => {
  it('muestra errores para formulario incompleto sin registrar', () => {
    const placeOrder = setup();
    fireEvent.click(screen.getByRole('button', { name: /registrar pedido simulado/i }));
    expect(screen.getByText(/corrige los campos señalados/i)).toBeInTheDocument();
    expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument();
    expect(placeOrder).not.toHaveBeenCalled();
  });
  it('solicita dirección y ciudad al elegir despacho', () => {
    setup();
    fireEvent.click(screen.getByRole('radio', { name: /despacho a domicilio/i }));
    fireEvent.click(screen.getByRole('button', { name: /registrar pedido simulado/i }));
    expect(screen.getByText(/dirección de 8 a 150 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/ciudad de 2 a 80 caracteres/i)).toBeInTheDocument();
  });
  it('registra pedido validado y navega al historial', () => {
    const placeOrder = setup();
    fireEvent.change(screen.getByLabelText(/nombre de contacto/i), { target: { value: 'Cliente Ficticio' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /comprendo que el pedido/i }));
    fireEvent.click(screen.getByRole('button', { name: /registrar pedido simulado/i }));
    expect(placeOrder).toHaveBeenCalledWith(expect.objectContaining({ name: 'Cliente Ficticio', fulfillment: 'retiro' }));
    expect(screen.getByText('Historial de prueba')).toBeInTheDocument();
  });
});
