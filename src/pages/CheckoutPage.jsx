import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { formatCLP } from '../services/productRepository.js';
import { FULFILLMENT, validateCheckout } from '../services/orderRepository.js';
import PageIntro from '../components/PageIntro.jsx';

const initialForm = { name: '', email: '', fulfillment: FULFILLMENT.PICKUP, city: '', address: '', notes: '' };

function FormField({ id, label, error, children }) {
  return <div><label htmlFor={id} className="form-label fw-semibold">{label}</label>{children}{error && <p id={`${id}-error`} className="small text-danger mt-1 mb-0" role="alert">{error}</p>}</div>;
}

export default function CheckoutPage() {
  const { lines, count, subtotal, storageError, adjustmentNotice } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [acknowledge, setAcknowledge] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const update = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setGeneralError('');
  };

  function submit(event) {
    event.preventDefault();
    if (submitting) return;
    const checked = validateCheckout(form);
    setErrors(checked.errors);
    if (Object.keys(checked.errors).length) { setGeneralError('Corrige los campos señalados.'); return; }
    if (!acknowledge) { setGeneralError('Confirma que entiendes que este pedido es una simulación académica.'); return; }
    setSubmitting(true);
    const result = placeOrder(form);
    if (result.error) {
      setErrors(result.errors ?? {});
      setGeneralError(result.error);
      setSubmitting(false);
      return;
    }
    navigate('/mis-pedidos', { replace: true, state: { createdId: result.order.id } });
  }

  return <section className="container section-space">
    <PageIntro eyebrow="CLIENTE · CONFIRMACIÓN" title="Confirmar pedido" description="Revisa tus productos, escoge despacho o retiro y registra un pedido simulado. No se efectúa ningún cobro." />
    <div className="alert alert-warning" role="note"><strong>Datos de prueba.</strong> Introduce datos ficticios. Este formulario guarda la información solo en el almacenamiento local del navegador: no envía mensajes, no gestiona pagos ni realiza entregas.</div>
    {adjustmentNotice && <div className="alert alert-warning" role="status">{adjustmentNotice}</div>}
    {storageError && <div className="alert alert-danger" role="alert">{storageError}</div>}
    {lines.length === 0 ? <div className="empty-state surface-panel" role="status"><h2 className="h4">No hay productos por confirmar</h2><p>Agrega productos al carrito para comenzar.</p><Link to="/catalogo" className="btn btn-warning fw-semibold">Ver catálogo</Link></div> : <div className="row g-4 align-items-start">
      <div className="col-lg-7">
        <form onSubmit={submit} noValidate className="surface-panel p-3 p-md-4" aria-label="Formulario para confirmar pedido">
          <h2 className="h4 fw-bold mb-3">Información del pedido</h2>
          <div className="row g-3">
            <div className="col-md-6"><FormField id="customer-name" label="Nombre de contacto *" error={errors.name}><input id="customer-name" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={form.name} autoComplete="off" maxLength={80} onChange={(e) => update('name', e.target.value)} aria-describedby={errors.name ? 'customer-name-error' : undefined} /></FormField></div>
            <div className="col-md-6"><FormField id="customer-email" label="Correo electrónico *" error={errors.email}><input id="customer-email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={form.email} autoComplete="off" maxLength={130} onChange={(e) => update('email', e.target.value)} aria-describedby={errors.email ? 'customer-email-error' : undefined}/></FormField></div>
            <div className="col-12"><fieldset><legend className="h6 fw-semibold mb-3">Modalidad de entrega *</legend><div className="d-flex flex-wrap gap-3"><label className="delivery-option"><input type="radio" name="fulfillment" checked={form.fulfillment === FULFILLMENT.PICKUP} onChange={() => update('fulfillment', FULFILLMENT.PICKUP)}/> Retiro en tienda</label><label className="delivery-option"><input type="radio" name="fulfillment" checked={form.fulfillment === FULFILLMENT.DELIVERY} onChange={() => update('fulfillment', FULFILLMENT.DELIVERY)}/> Despacho a domicilio</label></div></fieldset></div>
            {form.fulfillment === FULFILLMENT.DELIVERY && <>
              <div className="col-md-5"><FormField id="delivery-city" label="Ciudad *" error={errors.city}><input id="delivery-city" className={`form-control ${errors.city ? 'is-invalid' : ''}`} value={form.city} maxLength={80} onChange={(e) => update('city', e.target.value)}/></FormField></div>
              <div className="col-md-7"><FormField id="delivery-address" label="Dirección *" error={errors.address}><input id="delivery-address" className={`form-control ${errors.address ? 'is-invalid' : ''}`} value={form.address} maxLength={150} onChange={(e) => update('address', e.target.value)}/></FormField></div>
              <p className="text-secondary small mb-0">El valor del despacho no está definido en el caso académico: no se suma al total de productos.</p>
            </>}
            {form.fulfillment === FULFILLMENT.PICKUP && <p className="col-12 text-secondary small mb-0">El retiro será coordinado con la tienda de Viña del Mar. La dirección exacta todavía no está verificada.</p>}
            <div className="col-12"><FormField id="order-notes" label="Observaciones (opcional)" error={errors.notes}><textarea id="order-notes" rows={3} maxLength={250} className="form-control" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Ejemplo: solicitar confirmación de horario (sin datos reales)"/></FormField></div>
            <div className="col-12"><div className="form-check"><input className="form-check-input" id="confirm-demo" type="checkbox" checked={acknowledge} onChange={(e) => { setAcknowledge(e.target.checked); setGeneralError(''); }}/><label htmlFor="confirm-demo" className="form-check-label">Comprendo que el pedido y la información ingresada son solo para demostración, sin pago ni despacho real.</label></div></div>
            {generalError && <div className="col-12"><div className="alert alert-danger mb-0" role="alert">{generalError}</div></div>}
            <div className="col-12 d-flex flex-wrap gap-2"><button type="submit" disabled={submitting || !!storageError} className="btn btn-warning fw-bold">{submitting ? 'Registrando...' : 'Registrar pedido simulado'}</button><Link className="btn btn-outline-dark" to="/carrito">Volver al carrito</Link></div>
          </div>
        </form>
      </div>
      <div className="col-lg-5"><aside className="surface-panel p-4 cart-summary"><h2 className="h4 fw-bold mb-3">Resumen del pedido</h2><p className="text-secondary mb-3">{count} unidades</p><ul className="list-unstyled d-flex flex-column gap-3">{lines.map((line) => <li key={line.productId} className="d-flex justify-content-between gap-3"><span className="small">{line.quantity} × {line.product.name}<span className="d-block text-secondary">{line.product.id}</span></span><strong className="small text-nowrap">{formatCLP(line.lineTotal)}</strong></li>)}</ul><hr/><div className="d-flex justify-content-between"><strong>Total productos</strong><strong>{formatCLP(subtotal)}</strong></div><p className="small text-secondary mt-3 mb-0">No incluye despacho. No hay pasarela de pago ni cobros reales.</p></aside></div>
    </div>}
  </section>;
}
