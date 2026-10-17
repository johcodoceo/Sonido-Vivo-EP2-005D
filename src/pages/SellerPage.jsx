import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function SellerPage() {
  return <section className="container section-space">
    <PageIntro eyebrow="GESTIÓN INTERNA" title="Panel del vendedor" description="Disponible para los roles Vendedor y Administrador. Los datos son de demostración." />
    <div className="surface-panel p-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"><div><h2 className="h4">Controlar existencias</h2><p className="text-secondary mb-0">Ver artículos y ajustar el stock disponible en el navegador.</p></div><Link className="btn btn-warning fw-semibold" to="/vendedor/inventario">Abrir inventario →</Link></div>
    <div className="surface-panel p-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"><div><h2 className="h4">Gestionar pedidos simulados</h2><p className="text-secondary mb-0">Consultar solicitudes, filtrar y actualizar sus estados de preparación, despacho y entrega.</p></div><Link className="btn btn-warning fw-semibold" to="/vendedor/pedidos">Ver pedidos →</Link></div>
    <PlaceholderPanel icon="🎛️" title="Integración pendiente" text="Los pedidos de la EP2 son locales; la gestión multiusuario y el stock sincronizado requerirán Spring Boot y una base de datos." />
  </section>;
}
