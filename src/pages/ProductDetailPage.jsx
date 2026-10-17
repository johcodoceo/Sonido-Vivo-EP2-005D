import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';
import { categories } from '../data/categories.js';
import { formatCLP } from '../services/productRepository.js';
import DemoDataNotice from '../components/DemoDataNotice.jsx';
import { useOptionalCart } from '../context/CartContext.jsx';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const cart = useOptionalCart();
  const [requested, setRequested] = useState('1');
  const [feedback, setFeedback] = useState(null);
  const { products } = useProducts();
  const product = products.find((item) => item.id === productId);
  if (!product) return (
    <section className="container section-space"><h1 className="h2">Producto no encontrado</h1><p>Puede haber sido eliminado del catálogo de prueba.</p><Link className="btn btn-dark" to="/catalogo">Volver al catálogo</Link></section>
  );
  function addProduct(event) {
    event.preventDefault();
    const amount = Number(requested);
    if (!requested.trim() || !Number.isSafeInteger(amount) || amount < 1) {
      setFeedback({ type: 'danger', message: 'Ingresa una cantidad entera desde 1.' });
      return;
    }
    const error = cart.addItem(product.id, amount);
    setFeedback(error ? { type: 'danger', message: error } : { type: 'success', message: `${amount} unidad(es) agregada(s) al carrito.` });
  }
  const category = categories.find((item) => item.slug === product.categorySlug);
  return (
    <section className="container section-space">
      <Link to="/catalogo" className="text-link d-inline-block mb-4">← Volver al catálogo</Link>
      <DemoDataNotice />
      <div className="row g-4 align-items-start">
        <div className="col-lg-5"><div className={`product-art product-art-detail product-art-${product.categorySlug}`}><span className="product-art-icon" aria-hidden="true">{category?.icon ?? '🎼'}</span><span className="product-art-label">Representación ilustrativa · sin fotografía real</span></div></div>
        <div className="col-lg-7"><div className="surface-panel p-4 p-lg-5">
          <div className="eyebrow mb-2">{category?.name ?? 'Instrumentos'} · {product.id}</div>
          <h1 className="page-title mb-3">{product.name}</h1>
          <p className="text-secondary fs-5">{product.description}</p>
          <dl className="row mt-4"><dt className="col-4">Marca</dt><dd className="col-8">{product.brand}</dd><dt className="col-4">Modelo</dt><dd className="col-8">{product.model}</dd><dt className="col-4">Código</dt><dd className="col-8">{product.id}</dd><dt className="col-4">Stock según catálogo</dt><dd className="col-8">{product.stock > 0 ? `${product.stock} unidades` : 'Sin existencias'}</dd></dl>
          <div className="border-top pt-4 mt-3"><div className="eyebrow mb-2">PRECIO DEL CATÁLOGO ACADÉMICO</div><p className="display-6 fw-bold mb-3">{formatCLP(product.price)}</p>
            {cart?.canShop ? <form className="d-flex flex-wrap gap-2 align-items-end" onSubmit={addProduct} noValidate>
              <div><label className="form-label fw-semibold" htmlFor="detail-quantity">Cantidad</label><input id="detail-quantity" className="form-control" style={{ maxWidth: 110 }}
                type="number" min="1" max={product.stock} step="1" value={requested}
                onChange={(event) => { setRequested(event.target.value); setFeedback(null); }} disabled={product.stock === 0} /></div>
              <button className="btn btn-warning btn-lg fw-bold" disabled={product.stock === 0} type="submit">Agregar al carrito</button>
            </form> : <p className="text-secondary">La opción de compra está disponible al ingresar como Cliente o Administrador.</p>}
            {feedback && <div className={`mt-3 alert ${feedback.type === 'danger' ? 'alert-danger' : 'alert-success'}`} role="status">{feedback.message}</div>}
            {feedback?.type === 'success' && <Link className="btn btn-outline-dark mt-2" to="/carrito">Ver mi carrito →</Link>}
            <p className="small text-secondary mt-3 mb-0">Carrito de demostración: sin pago ni reserva de stock.</p>
          </div>
        </div></div>
      </div>
    </section>
  );
}
