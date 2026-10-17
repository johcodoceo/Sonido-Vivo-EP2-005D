import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard.jsx';

describe('CategoryCard', () => {
  it('muestra una categoría recibida por props y prepara la navegación', () => {
    const category = { name: 'Guitarras', slug: 'guitarras', description: 'Instrumentos', icon: '🎸' };
    render(<MemoryRouter><CategoryCard category={category} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /guitarras/i })).toHaveAttribute('href', '/catalogo?categoria=guitarras');
    expect(screen.getByText('Instrumentos')).toBeInTheDocument();
  });
});
