import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { initialProducts } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';

describe('ProductCard', () => {
  it('renderiza datos recibidos por props y ofrece detalle', () => {
    const product = initialProducts[0];
    render(<MemoryRouter><ProductCard product={product} /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: product.name })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: `Ver detalle de ${product.name}` })).toHaveAttribute('href', `/catalogo/${product.id}`);
  });
  it('indica sin stock cuando la existencia es cero', () => {
    render(<MemoryRouter><ProductCard product={{ ...initialProducts[0], stock: 0 }} /></MemoryRouter>);
    expect(screen.getByText('Sin stock')).toBeInTheDocument();
  });
});
