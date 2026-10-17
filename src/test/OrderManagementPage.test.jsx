import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import OrderManagementPage from '../pages/OrderManagementPage.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { createOrder, ORDER_STATUS } from '../services/orderRepository.js';
import { initialProducts } from '../data/products.js';

vi.mock('../context/OrderContext.jsx', () => ({ useOrders: vi.fn() }));
const products = initialProducts;
const items = [{ productId: products[0].id, quantity: 1 }];
const base = { name: 'Cliente Retiro', email: 'retiro@example.com', fulfillment: 'retiro' };
const pickup = createOrder([], items, products, 'demo-cliente', base, '2026-10-14T12:00:00.000Z').order;
const delivery = createOrder([pickup], items, products, 'demo-cliente',
  { ...base, name: 'Cliente Despacho', fulfillment: 'despacho', city: 'Valparaíso', address: 'Av. Ejemplo 1234' },
  '2026-10-14T12:00:01.000Z').order;

function view(orders = [pickup, delivery]) {
  const advanceOrder = vi.fn(() => null);
  vi.mocked(useOrders).mockReturnValue({ orders, advanceOrder });
  render(<OrderManagementPage />);
  return advanceOrder;
}

describe('Gestión de pedidos por Vendedor o Administrador', () => {
  it('filtra los pedidos por modalidad de entrega', () => {
    view();
    fireEvent.change(screen.getByLabelText('Entrega'), { target: { value: 'retiro' } });
    expect(screen.getByRole('heading', { name: pickup.id })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: delivery.id })).not.toBeInTheDocument();
    expect(screen.getByText('Mostrando 1 de 2 pedidos locales.')).toBeInTheDocument();
  });
  it('permite buscar por nombre y muestra ausencia de resultados', () => {
    view();
    fireEvent.change(screen.getByLabelText('Buscar pedido o nombre'), { target: { value: 'SIN COINCIDENCIA' } });
    expect(screen.getByRole('heading', { name: 'No hay pedidos que coincidan' })).toBeInTheDocument();
  });
  it('permite marcar listo para retiro utilizando spy del contexto', () => {
    const advanceOrder = view([pickup]);
    fireEvent.click(screen.getByRole('button', { name: /marcar listo para retiro/i }));
    expect(advanceOrder).toHaveBeenCalledWith(pickup.id, ORDER_STATUS.READY);
  });
  it('solo permite despachar (no entregar directamente) un pedido de despacho', () => {
    view([delivery]);
    expect(screen.getByRole('button', { name: /marcar despachado/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /marcar entregado/i })).not.toBeInTheDocument();
  });
});
