import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatCLP } from '../services/productRepository.js';
import { categories } from '../data/categories.js';
import PageIntro from '../components/PageIntro.jsx';
import CartQuantityControl from '../components/CartQuantityControl.jsx';
import DemoDataNotice from '../components/DemoDataNotice.jsx';

export default function CartPage() {
  const { lines, count, subtotal, storageError, adjustmentNotice, changeQuantity, removeItem, clearCart } = useCart();
  const [confirmClear, setConfirmClear] = useState(false);
  const [feedback, setFeedback] = useState('');

  function remove(productId) {
    removeItem(productId);
    setFeedback('Producto quitado del carrito.');
    setConfirmClear(false);
  }

  function emptyCart() {
    clearCart();
    setConfirmClear(false);
    setFeedback('Se vació el carrito.');
  }

  return <section className="container section-space">
    <PageIntro eyebrow="CLIENTE · CARRITO" title="Mi carrito" description="Revisa los productos seleccionados y cambia sus cantidades. Los precios y la disponibilidad provienen del catálogo de Sonido Vivo." />
    <DemoDataNotice />
    {storageError && <div className="alert alert-danger" role="alert">{storageError}</div>}
    {adjustmentNotice && <div className="alert alert-warning" role="status">{adjustmentNotice}</div>}
    {feedback && <div className="alert alert-success" role="status">{feedback}</div>}

    {lines.length === 0 ? (
      <div className="empty-state surface-panel" role="status">
        <div className="empty-icon" aria-hidden="true">🛒</div>
        <h2 className="h3 fw-bold">Tu carrito está vacío</h2>
        <p className="text-secondary">Explora los 51 productos iniciales del catálogo y elige los que quieres llevar.</p>
        <Link className="btn btn-warning fw-bold" to="/catalogo">Explorar catálogo →</Link>
      </div>
    ) : <div className="row g-4 align-items-start">
      <div className="col-lg-8">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <h2 className="h5 mb-0">Productos seleccionados ({count} unidades)</h2>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => setConfirmClear((wasOpen) => !wasOpen)}>Vaciar carrito</button>
        </div>
        {confirmClear && <div className="alert alert-warning" role="group" aria-label="Confirmación para vaciar carrito">
          <p className="mb-2">¿Quieres quitar todos los productos de tu carrito?</p>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-danger btn-sm" type="button" onClick={emptyCart}>Sí, vaciar carrito</button>
            <button className="btn btn-outline-dark btn-sm" type="button" onClick={() => setConfirmClear(false)}>Cancelar</button>
          </div>
        </div>}
        <div className="d-flex flex-column gap-3">
          {lines.map(({ productId, product, quantity, lineTotal }) => {
            const category = categories.find((item) => item.slug === product.categorySlug);
            return <article className="surface-panel p-3 p-md-4" key={productId}>
              <div className="d-flex align-items-start gap-3 flex-column flex-sm-row">
                <div className={`cart-art product-art-${product.categorySlug}`} aria-hidden="true">{category?.icon ?? '🎼'}</div>
                <div className="flex-grow-1 w-100 min-width-zero">
                  <div className="small text-secondary mb-1">{product.id} · {product.brand} · {product.model}</div>
                  <h3 className="h5 fw-bold mb-2"><Link className="cart-product-link" to={`/catalogo/${productId}`}>{product.name}</Link></h3>
                  <p className="mb-1"><strong>{formatCLP(product.price)}</strong> <span className="text-secondary small">por unidad</span></p>
                  <p className="small text-secondary mb-3">Disponibles: {product.stock}</p>
                  <CartQuantityControl productId={productId} productName={product.name} quantity={quantity} stock={product.stock} onChange={changeQuantity} />
                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3 pt-3 border-top">
                    <button className="btn btn-link text-danger px-0 btn-sm" type="button" onClick={() => remove(productId)} aria-label={`Quitar ${product.name} del carrito`}>Quitar producto</button>
                    <span>Subtotal: <strong className="fs-5">{formatCLP(lineTotal)}</strong></span>
                  </div>
                </div>
              </div>
            </article>;
          })}
        </div>
        <Link to="/catalogo" className="text-link d-inline-block mt-4">← Seguir explorando productos</Link>
      </div>
      <div className="col-lg-4">
        <aside className="surface-panel p-4 cart-summary" aria-label="Resumen de compra">
          <h2 className="h4 fw-bold mb-4">Resumen del carrito</h2>
          <div className="d-flex justify-content-between mb-3"><span>Unidades</span><strong>{count}</strong></div>
          <div className="d-flex justify-content-between mb-3"><span>Subtotal</span><strong>{formatCLP(subtotal)}</strong></div>
          <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center"><span className="fw-bold">Total estimado</span><strong className="h3 fw-bold mb-0">{formatCLP(subtotal)}</strong></div>
          <p className="small text-secondary mt-3">Total de productos, sin gastos de envío. No se cobra ni se reserva stock al agregar artículos.</p>
          <Link to="/confirmar-pedido" className="btn btn-warning fw-bold w-100 mt-2">Continuar a confirmar pedido →</Link>
          <p className="small text-secondary mt-2 mb-0">Se registrará un pedido local con despacho o retiro simulado. Sin pago real.</p>
        </aside>
      </div>
    </div>}
  </section>;
}
