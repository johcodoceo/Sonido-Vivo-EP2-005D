import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOptionalCart } from '../context/CartContext.jsx';
import { categories } from '../data/categories.js';
import { formatCLP } from '../services/productRepository.js';

export default function ProductCard({ product }) {
  const cart = useOptionalCart();
  const [feedback, setFeedback] = useState(null);
  function handleAdd() {
    const error = cart.addItem(product.id);
    setFeedback(error ? { type: 'danger', message: error } : { type: 'success', message: 'Producto agregado al carrito.' });
  }
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
        <div className="d-grid gap-2">
          <Link className="btn btn-outline-dark" to={`/catalogo/${product.id}`} aria-label={`Ver detalle de ${product.name}`}>Ver detalle →</Link>
          {cart?.canShop && <button className="btn btn-warning fw-bold" type="button" disabled={product.stock === 0}
            onClick={handleAdd} aria-label={`Agregar ${product.name} al carrito`}>🛒 Agregar al carrito</button>}
          {feedback && <div className={`small ${feedback.type === 'danger' ? 'text-danger' : 'text-success'}`} role="status">{feedback.message}</div>}
        </div>
      </div>
    </article>
  );
}
