import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CartPage from '../pages/CartPage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { initialProducts } from '../data/products.js';

vi.mock('../context/CartContext.jsx', () => ({ useCart: vi.fn() }));
const product = initialProducts[0];
const mocks = () => ({ lines: [], count: 0, subtotal: 0, storageError: '', adjustmentNotice: '', changeQuantity: vi.fn(), removeItem: vi.fn(), clearCart: vi.fn() });

describe('CartPage', () => {
  it('presenta un estado vacío y enlace al catálogo', () => {
    vi.mocked(useCart).mockReturnValue(mocks());
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /tu carrito está vacío/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explorar catálogo/i })).toHaveAttribute('href', '/catalogo');
  });
  it('muestra un ítem y su subtotal y permite quitarlo', () => {
    const state = { ...mocks(), lines: [{ productId: product.id, product, quantity: 2, lineTotal: 2 * product.price }], count: 2, subtotal: 2 * product.price };
    vi.mocked(useCart).mockReturnValue(state);
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    expect(screen.getByText(product.name)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /resumen del carrito/i })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /confirmar pedido/i })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: /quitar .* del carrito/i }));
    expect(state.removeItem).toHaveBeenCalledWith(product.id);
  });
  it('confirma antes de vaciar el carrito', () => {
    const state = { ...mocks(), lines: [{ productId: product.id, product, quantity: 1, lineTotal: product.price }], count: 1, subtotal: product.price };
    vi.mocked(useCart).mockReturnValue(state);
    render(<MemoryRouter><CartPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }));
    expect(state.clearCart).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Sí, vaciar carrito' }));
    expect(state.clearCart).toHaveBeenCalledOnce();
  });
});
