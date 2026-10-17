import PageIntro from '../components/PageIntro.jsx';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function CartPage() {
  return <section className="container section-space"><PageIntro eyebrow="CLIENTE" title="Mi carrito" description="Flujo de compra preparado para futuras etapas." /><PlaceholderPanel icon="🛒" title="Tu carrito todavía no almacena productos" text="La selección de artículos, cálculo del total y persistencia se incorporarán después de implementar el catálogo." points={['Agregar y quitar productos', 'Cambiar cantidades', 'Validar existencias antes de confirmar un pedido']} /></section>;
}
