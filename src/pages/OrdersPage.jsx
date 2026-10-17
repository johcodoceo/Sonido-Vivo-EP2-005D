import { Link, useLocation } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import OrderCard from '../components/OrderCard.jsx';
import { useOrders } from '../context/OrderContext.jsx';

export default function OrdersPage() {
  const { mine } = useOrders();
  const { state } = useLocation();
  return <section className="container section-space">
    <PageIntro eyebrow="CLIENTE" title="Mis pedidos" description="Revisa únicamente los pedidos asociados a tu perfil de demostración y sigue su estado." />
    <div className="alert alert-info" role="note">Pedidos almacenados en este navegador. Ningún pedido genera pago, despacho ni confirmación externa real.</div>
    {state?.createdId && <div className="alert alert-success" role="status">Pedido <strong>{state.createdId}</strong> registrado correctamente en esta simulación. Tu carrito quedó vacío y el stock local se actualizó.</div>}
    {mine.length === 0 ? <div className="empty-state surface-panel"><div className="empty-icon" aria-hidden="true">📦</div><h2 className="h4">Todavía no tienes pedidos</h2><p>Al confirmar un carrito aparecerá aquí su seguimiento.</p><Link to="/catalogo" className="btn btn-warning fw-semibold">Ir al catálogo</Link></div>
      : <div className="d-flex flex-column gap-3">{mine.map((order) => <OrderCard key={order.id} order={order} />)}</div>}
  </section>;
}
