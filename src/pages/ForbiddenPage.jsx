import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';

export default function ForbiddenPage() {
  return <section className="container section-space"><PageIntro eyebrow="ACCESO RESTRINGIDO" title="No tienes acceso a esa sección" description="El rol seleccionado no tiene permiso de navegación para esta vista en modo demostración." /><Link className="btn btn-warning" to="/inicio">Regresar al inicio</Link></section>;
}
