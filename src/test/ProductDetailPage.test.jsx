import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import { initialProducts } from '../data/products.js';

vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));

describe('ProductDetailPage', () => {
  function mount(path) {
    return render(<MemoryRouter initialEntries={[path]}><Routes><Route path="/catalogo/:productId" element={<ProductDetailPage/>}/></Routes></MemoryRouter>);
  }
  it('muestra la información del producto sin permitir compras todavía', () => {
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts });
    mount('/catalogo/GA001');
    expect(screen.getByRole('heading', { name: initialProducts[0].name })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agregar al carrito/i })).toBeDisabled();
  });
  it('muestra una alternativa cuando el código del producto no existe', () => {
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts });
    mount('/catalogo/no-existe');
    expect(screen.getByRole('heading', { name: /producto no encontrado/i })).toBeInTheDocument();
  });
});
