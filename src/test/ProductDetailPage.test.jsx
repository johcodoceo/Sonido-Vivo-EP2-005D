import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import { useOptionalCart } from '../context/CartContext.jsx';
import { initialProducts } from '../data/products.js';

vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));
vi.mock('../context/CartContext.jsx', () => ({ useOptionalCart: vi.fn() }));

describe('ProductDetailPage - Etapa 3', () => {
  function mount(path) {
    return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/catalogo/:productId" element={<ProductDetailPage/>}/></Routes></MemoryRouter>);
  }
  it('agrega unidades de un producto al carrito con interacción real', () => {
    const addItem = vi.fn(() => null);
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts });
    vi.mocked(useOptionalCart).mockReturnValue({ canShop: true, addItem });
    mount('/catalogo/GA001');
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }));
    expect(addItem).toHaveBeenCalledWith('GA001', 2);
    expect(screen.getByRole('link', { name: /ver mi carrito/i })).toHaveAttribute('href', '/carrito');
  });
  it('rechaza cantidad inválida antes de llamar al carrito', () => {
    const addItem = vi.fn();
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts });
    vi.mocked(useOptionalCart).mockReturnValue({ canShop: true, addItem });
    mount('/catalogo/GA001');
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /agregar al carrito/i }));
    expect(addItem).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent(/cantidad entera/i);
  });
  it('muestra una alternativa cuando el código no existe', () => {
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts });
    vi.mocked(useOptionalCart).mockReturnValue({ canShop: true, addItem: vi.fn() });
    mount('/catalogo/no-existe');
    expect(screen.getByRole('heading', { name: /producto no encontrado/i })).toBeInTheDocument();
  });
});
