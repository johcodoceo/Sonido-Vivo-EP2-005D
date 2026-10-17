import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { initialProducts } from '../data/products.js';
import InventoryPage from '../pages/InventoryPage.jsx';
import { useProducts } from '../context/ProductContext.jsx';

vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));

describe('InventoryPage', () => {
  it('permite al vendedor solicitar ajuste válido de stock usando un spy', () => {
    const setStock = vi.fn(() => null);
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts.slice(0,1), setStock, storageError:'' });
    render(<MemoryRouter><InventoryPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/nuevo stock de guitarra acústica folk/i), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(setStock).toHaveBeenCalledWith('GA001', 3);
    expect(screen.getByText(/stock actualizado/i)).toBeInTheDocument();
  });
  it('impide stock decimal o negativo', () => {
    const setStock = vi.fn();
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts.slice(0,1), setStock, storageError:'' });
    render(<MemoryRouter><InventoryPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/nuevo stock de guitarra acústica folk/i), { target: { value: '-1' } });
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(setStock).not.toHaveBeenCalled();
    expect(screen.getByText(/stock inválido/i)).toBeInTheDocument();
  });
});
