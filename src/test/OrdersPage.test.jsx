import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import OrdersPage from '../pages/OrdersPage.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { createOrder } from '../services/orderRepository.js';
import { initialProducts } from '../data/products.js';

vi.mock('../context/OrderContext.jsx', () => ({ useOrders: vi.fn() }));
const product = initialProducts[0];
const sampleOrder = createOrder([], [{ productId: product.id, quantity: 1 }], initialProducts,
  'demo-cliente', { name: 'Cliente de Ejemplo', email: 'cliente@example.com', fulfillment: 'retiro' },
  '2026-10-14T12:00:00.000Z').order;

function view(mine, state = null) {
  vi.mocked(useOrders).mockReturnValue({ mine });
  render(<MemoryRouter initialEntries={[{ pathname: '/mis-pedidos', state }]}>
    <Routes><Route path="/mis-pedidos" element={<OrdersPage />} /></Routes>
  </MemoryRouter>);
}

describe('Historial del Cliente', () => {
  it('muestra el estado vacío sin inventar pedidos', () => {
    view([]);
    expect(screen.getByRole('heading', { name: 'Todavía no tienes pedidos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ir al catálogo' })).toHaveAttribute('href', '/catalogo');
  });
  it('muestra la confirmación del código recién creado', () => {
    view([sampleOrder], { createdId: sampleOrder.id });
    expect(screen.getByRole('status')).toHaveTextContent(sampleOrder.id);
    expect(screen.getByRole('heading', { name: sampleOrder.id })).toBeInTheDocument();
  });
  it('deja consultar el detalle sin ofrecer cambios de estado al Cliente', () => {
    view([sampleOrder]);
    fireEvent.click(screen.getByRole('button', { name: /ver detalle y seguimiento/i }));
    expect(screen.getByText(/Cliente de Ejemplo · cliente@example.com/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /marcar listo/i })).not.toBeInTheDocument();
  });
});
