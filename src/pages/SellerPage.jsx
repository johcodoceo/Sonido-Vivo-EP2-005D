import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function SellerPage() {
  return <section className="container section-space">
    <PageIntro eyebrow="GESTIÓN INTERNA" title="Panel del vendedor" description="Disponible para los roles Vendedor y Administrador. Los datos son de demostración." />
    <div className="surface-panel p-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"><div><h2 className="h4">Controlar existencias</h2><p className="text-secondary mb-0">Ver artículos y ajustar el stock disponible en el navegador.</p></div><Link className="btn btn-warning fw-semibold" to="/vendedor/inventario">Abrir inventario →</Link></div>
    <PlaceholderPanel icon="🎛️" title="Gestión de pedidos: siguiente etapa" text="El seguimiento de pedidos y la conexión a la base de datos aún no están implementados." points={['Consultar pedidos de clientes', 'Cambiar estados de pedidos', 'Sincronizar inventario con el backend']} />
  </section>;
}
