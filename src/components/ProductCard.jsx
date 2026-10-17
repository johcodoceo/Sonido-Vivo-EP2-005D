import { Link } from 'react-router-dom';
import { categories } from '../data/categories.js';
import { formatCLP } from '../services/productRepository.js';

export default function ProductCard({ product }) {
  const category = categories.find((item) => item.slug === product.categorySlug);
  return (
    <article className="product-card h-100 d-flex flex-column">
      <div className={`product-art product-art-${product.categorySlug}`}>
        <span aria-hidden="true" className="product-art-icon">{category?.icon ?? '🎼'}</span>
        <span className="product-art-label">Representación ilustrativa</span>
      </div>
      <div className="p-4 d-flex flex-column flex-grow-1">
        <div className="small text-uppercase text-secondary fw-bold mb-2">{category?.name ?? 'Otros'} · {product.brand}</div>
        <h2 className="h5 product-name mb-1">{product.name}</h2>
        <p className="small text-secondary mb-2">Modelo: {product.model}</p>
        <p className="text-secondary small line-clamp-2 mb-3">{product.description}</p>
        <div className="d-flex align-items-center justify-content-between gap-2 mt-auto mb-3">
          <strong className="fs-5">{formatCLP(product.price)}</strong>
          <span className={`badge ${product.stock > 0 ? 'text-bg-success' : 'text-bg-danger'}`}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
          </span>
        </div>
        <Link className="btn btn-outline-dark w-100" to={`/catalogo/${product.id}`} aria-label={`Ver detalle de ${product.name}`}>Ver detalle →</Link>
      </div>
    </article>
  );
}
