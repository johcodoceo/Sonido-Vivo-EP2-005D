import { useState } from 'react';
import { formatCLP } from '../services/productRepository.js';
import { FULFILLMENT_NAMES, nextStatuses, STATUS_NAMES } from '../services/orderRepository.js';

function formatDate(iso) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export default function OrderCard({ order, staff = false, onAdvance }) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState('');
  const options = nextStatuses(order);

  function advance(status) {
    const error = onAdvance?.(order.id, status);
    setFeedback(error || `Se registró el estado «${STATUS_NAMES[status]}».`);
  }

  return <article className="surface-panel p-3 p-md-4 order-card">
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
      <div className="min-width-zero">
        <p className="eyebrow mb-1">PEDIDO DE DEMOSTRACIÓN</p>
        <h2 className="h5 fw-bold mb-1 order-id">{order.id}</h2>
        <p className="small text-secondary mb-0">Creado el {formatDate(order.createdAt)}</p>
      </div>
      <span className={`order-status ${order.status === 'entregado' ? 'order-status-done' : ''}`}>{STATUS_NAMES[order.status]}</span>
    </div>
    <div className="row g-3 mb-3">
      <div className="col-sm-6 col-lg-4"><span className="text-secondary small d-block">Entrega</span><strong>{FULFILLMENT_NAMES[order.fulfillment]}</strong></div>
      <div className="col-sm-6 col-lg-4"><span className="text-secondary small d-block">Artículos</span><strong>{order.lines.reduce((n, item) => n + item.quantity, 0)} unidades</strong></div>
      <div className="col-sm-6 col-lg-4"><span className="text-secondary small d-block">Total de productos</span><strong>{formatCLP(order.totalProducts)}</strong></div>
    </div>
    <div className="d-flex gap-2 flex-wrap align-items-center">
      <button type="button" className="btn btn-outline-dark btn-sm" aria-expanded={expanded} onClick={() => setExpanded((old) => !old)}>{expanded ? 'Ocultar detalle' : 'Ver detalle y seguimiento'}</button>
      {staff && options.map((status) => <button key={status} className="btn btn-warning btn-sm fw-semibold" type="button" onClick={() => advance(status)}>Marcar {STATUS_NAMES[status].toLowerCase()}</button>)}
    </div>
    {feedback && <div className={`alert mt-3 mb-0 ${feedback.startsWith('Se registró') ? 'alert-success' : 'alert-danger'}`} role="status">{feedback}</div>}
    {expanded && <div className="border-top mt-4 pt-3">
      <h3 className="h6 fw-bold">Productos del pedido</h3>
      <div className="table-responsive"><table className="table table-sm align-middle"><thead><tr><th scope="col">Producto</th><th scope="col">Cantidad</th><th scope="col">Precio unit.</th><th scope="col">Subtotal</th></tr></thead><tbody>{order.lines.map((line) => <tr key={line.productId}><td>{line.name}<span className="small text-secondary d-block">{line.productId} · {line.brand} · {line.model}</span></td><td>{line.quantity}</td><td>{formatCLP(line.unitPrice)}</td><td>{formatCLP(line.lineTotal)}</td></tr>)}</tbody></table></div>
      <h3 className="h6 fw-bold mt-3">Datos de entrega (ficticios)</h3>
      <p className="mb-1">{order.contact.name} · {order.contact.email}</p>
      <p className="small text-secondary">{order.fulfillment === 'retiro' ? 'Retiro en tienda: coordinación pendiente.' : `${order.destination.address}, ${order.destination.city} (dirección ingresada para la simulación)`}</p>
      {order.notes && <p className="small"><strong>Observaciones:</strong> {order.notes}</p>}
      <p className="small text-secondary">Pago: no realizado. {order.fulfillment === 'despacho' ? 'El costo del envío no está calculado ni incluido.' : 'Sin costo de envío calculado para retiro.'}</p>
      <h3 className="h6 fw-bold mt-3">Seguimiento</h3>
      <ol className="order-timeline mb-0">{order.statusHistory.map((entry, index) => <li key={`${entry.status}-${index}`}><strong>{STATUS_NAMES[entry.status]}</strong><span className="small text-secondary d-block">{formatDate(entry.at)}</span></li>)}</ol>
    </div>}
  </article>;
}
