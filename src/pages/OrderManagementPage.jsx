import { useMemo, useState } from 'react';
import PageIntro from '../components/PageIntro.jsx';
import OrderCard from '../components/OrderCard.jsx';
import { useOrders } from '../context/OrderContext.jsx';
import { FULFILLMENT_NAMES, STATUS_NAMES } from '../services/orderRepository.js';

export default function OrderManagementPage() {
  const { orders, advanceOrder } = useOrders();
  const [status, setStatus] = useState('');
  const [fulfillment, setFulfillment] = useState('');
  const [query, setQuery] = useState('');
  const matching = useMemo(() => orders.filter((o) =>
    (!status || o.status === status) && (!fulfillment || o.fulfillment === fulfillment) &&
    (!query || [o.id, o.contact.name].some((s) => s.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es').trim()))),
  ), [orders, status, fulfillment, query]);
  return <section className="container section-space">
    <PageIntro eyebrow="VENDEDOR · ADMINISTRADOR" title="Gestión de pedidos" description="Consulta solicitudes de demostración y actualiza su progreso. Los pedidos de despacho y retiro siguen rutas distintas." />
    <div className="alert alert-info" role="note">Solo funciona en este navegador. Los cambios de estado no envían mensajes, no crean despachos ni se sincronizan con una base de datos.</div>
    <div className="surface-panel p-3 p-md-4 mb-4"><div className="row g-3 align-items-end">
      <div className="col-md-5"><label htmlFor="order-search" className="form-label fw-semibold">Buscar pedido o nombre</label><input className="form-control" id="order-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Código o cliente ficticio" /></div>
      <div className="col-md-4"><label htmlFor="order-status-filter" className="form-label fw-semibold">Estado</label><select id="order-status-filter" className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Todos los estados</option>{Object.entries(STATUS_NAMES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <div className="col-md-3"><label htmlFor="order-type-filter" className="form-label fw-semibold">Entrega</label><select id="order-type-filter" className="form-select" value={fulfillment} onChange={(e) => setFulfillment(e.target.value)}><option value="">Todos los tipos</option>{Object.entries(FULFILLMENT_NAMES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    </div></div>
    <p className="text-secondary small">Mostrando {matching.length} de {orders.length} pedidos locales.</p>
    {matching.length === 0 ? <div className="empty-state surface-panel"><h2 className="h4">No hay pedidos que coincidan</h2><p className="mb-0">Confirma un carrito como Cliente o ajusta los filtros.</p></div> : <div className="d-flex flex-column gap-3">{matching.map((order) => <OrderCard key={order.id} order={order} staff onAdvance={advanceOrder} />)}</div>}
  </section>;
}
