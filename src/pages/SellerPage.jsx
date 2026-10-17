import PageIntro from '../components/PageIntro.jsx';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function SellerPage() {
  return <section className="container section-space"><PageIntro eyebrow="GESTIÓN INTERNA" title="Panel del vendedor" description="Zona disponible únicamente para los roles Vendedor y Administrador en la demostración." /><PlaceholderPanel icon="🎛️" title="Módulos pendientes de implementar" text="Aquí se incorporarán controles del stock y seguimiento de los pedidos de la tienda." points={['Consultar existencias', 'Actualizar stock', 'Cambiar estados de pedidos']} /></section>;
}
