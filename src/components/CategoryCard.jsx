import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
  return (
    <Link className="category-card text-decoration-none h-100 d-flex flex-column align-items-start" to={`/catalogo?categoria=${encodeURIComponent(category.slug)}`}>
      <span className="category-icon" aria-hidden="true">{category.icon}</span>
      <strong className="fs-5 mt-3 mb-2">{category.name}</strong>
      <span className="text-secondary small">{category.description}</span>
      <span className="small text-secondary mt-2">{category.referencesApprox} referencias aprox. en el negocio</span>
      <span className="category-arrow mt-auto pt-3">Explorar <span aria-hidden="true">→</span></span>
    </Link>
  );
}
