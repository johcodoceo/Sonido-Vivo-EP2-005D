import PageIntro from '../components/PageIntro.jsx';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function OrdersPage() {
  return <section className="container section-space"><PageIntro eyebrow="CLIENTE" title="Mis pedidos" description="Espacio reservado para el historial de compras del cliente." /><PlaceholderPanel icon="📦" title="Aún no hay un módulo de pedidos" text="En una próxima etapa se simularán pedidos y sus estados de seguimiento, con datos separados por cliente." points={['En preparación', 'Despachado', 'Entregado']} /></section>;
}
