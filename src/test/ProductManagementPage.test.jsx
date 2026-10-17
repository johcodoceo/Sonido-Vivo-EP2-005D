import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductManagementPage from '../pages/ProductManagementPage.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import { initialProducts } from '../data/products.js';

vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));

describe('ProductManagementPage', () => {
  it('solicita confirmar una eliminación y permite cancelarla', () => {
    const removeProduct = vi.fn();
    vi.mocked(useProducts).mockReturnValue({ products: initialProducts.slice(0,1), storageError:'', removeProduct, addProduct:vi.fn(), editProduct:vi.fn() });
    render(<MemoryRouter><ProductManagementPage /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: `Eliminar ${initialProducts[0].name}` }));
    expect(screen.getByText(/¿eliminar/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(removeProduct).not.toHaveBeenCalled();
  });
});
