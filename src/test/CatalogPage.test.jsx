import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CatalogPage from '../pages/CatalogPage.jsx';
import { initialProducts } from '../data/products.js';
import { useProducts } from '../context/ProductContext.jsx';

vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));

describe('CatalogPage - interacciones', () => {
  it('filtra al escribir nombre en búsqueda', () => {
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts });
    render(<MemoryRouter><CatalogPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/buscar instrumentos/i), { target: { value: 'SM58' } });
    expect(screen.getByRole('heading', { name: /micrófono dinámico cardioide/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /guitarra acústica folk/i })).not.toBeInTheDocument();
  });
  it('muestra estado sin coincidencias y permite limpiar filtros', () => {
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts });
    render(<MemoryRouter><CatalogPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/buscar instrumentos/i), { target: { value: 'zz-no-existe' } });
    expect(screen.getByText(/no encontramos productos/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /mostrar catálogo completo/i }));
    expect(screen.getAllByRole('link', { name: /ver detalle de/i })).toHaveLength(51);
  });
});
