import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import OrderCard from '../components/OrderCard.jsx';
import { createOrder, ORDER_STATUS } from '../services/orderRepository.js';
import { initialProducts } from '../data/products.js';
const pickup = { name: 'Cliente Ficticio', email: 'demo@example.com', fulfillment: 'retiro' };
const order = createOrder([], [{ productId: initialProducts[0].id, quantity: 1 }], initialProducts, 'demo-cliente', pickup).order;

describe('OrderCard', () => {
  it('cliente ve pedido pero no puede modificar su estado', () => {
    render(<OrderCard order={order} />);
    expect(screen.getByText('En preparación')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /marcar listo para retiro/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /ver detalle y seguimiento/i }));
    expect(screen.getByText('Cliente Ficticio · demo@example.com')).toBeInTheDocument();
  });
  it('vendedor puede solicitar transición de retiro', () => {
    const advance = vi.fn().mockReturnValue(null);
    render(<OrderCard order={order} staff onAdvance={advance} />);
    fireEvent.click(screen.getByRole('button', { name: /marcar listo para retiro/i }));
    expect(advance).toHaveBeenCalledWith(order.id, ORDER_STATUS.READY);
  });
});
