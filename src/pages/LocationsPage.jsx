import PageIntro from '../components/PageIntro.jsx';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function LocationsPage() {
  return <section className="container section-space"><PageIntro eyebrow="TIENDA FÍSICA" title="Encuéntranos" description="Sonido Vivo está ubicada en Viña del Mar, Región de Valparaíso." /><PlaceholderPanel icon="📍" title="Próximamente: mapa y puntos de retiro" text="El caso requiere Leaflet o Google Maps. No se ha proporcionado una dirección específica, por lo que no inventamos una ubicación ni puntos de retiro." /></section>;
}
