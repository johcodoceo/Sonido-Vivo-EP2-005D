import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { initialProducts } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import { useOptionalCart } from '../context/CartContext.jsx';

vi.mock('../context/CartContext.jsx', () => ({ useOptionalCart: vi.fn() }));

describe('ProductCard', () => {
  it('renderiza datos recibidos por props y permite agregar al carrito', () => {
    const product = initialProducts[0];
    const addItem = vi.fn(() => null);
    vi.mocked(useOptionalCart).mockReturnValue({ canShop: true, addItem });
    render(<MemoryRouter><ProductCard product={product} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: `Ver detalle de ${product.name}` })).toHaveAttribute('href', `/catalogo/${product.id}`);
    fireEvent.click(screen.getByRole('button', { name: `Agregar ${product.name} al carrito` }));
    expect(addItem).toHaveBeenCalledWith(product.id);
    expect(screen.getByRole('status')).toHaveTextContent(/agregado al carrito/i);
  });
  it('no permite comprar producto agotado', () => {
    vi.mocked(useOptionalCart).mockReturnValue({ canShop: true, addItem: vi.fn() });
    render(<MemoryRouter><ProductCard product={{ ...initialProducts[0], stock: 0 }} /></MemoryRouter>);
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar.* al carrito/i })).toBeDisabled();
  });
  it('el Vendedor no visualiza botón de compra', () => {
    vi.mocked(useOptionalCart).mockReturnValue({ canShop: false, addItem: vi.fn() });
    render(<MemoryRouter><ProductCard product={initialProducts[0]} /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: /agregar.* al carrito/i })).not.toBeInTheDocument();
  });
});
