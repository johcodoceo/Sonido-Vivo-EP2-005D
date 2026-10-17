import PageIntro from '../components/PageIntro.jsx';
import PlaceholderPanel from '../components/PlaceholderPanel.jsx';

export default function AdminPage() {
  return <section className="container section-space"><PageIntro eyebrow="ROL ADMINISTRADOR" title="Panel de administración" description="El menú y la ruta están reservados para el rol Administrador en esta demostración." /><PlaceholderPanel icon="📊" title="Panel administrativo en construcción" text="La administración real de usuarios y los reportes formarán parte de las etapas posteriores." points={['Crear, editar y desactivar usuarios', 'Asignar roles', 'Consultar reportes y ventas']} /></section>;
}
