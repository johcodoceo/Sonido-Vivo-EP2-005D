import { Link } from 'react-router-dom';
import PageIntro from '../components/PageIntro.jsx';


export default function AdminPage() {
  return <section className="container section-space">
    <PageIntro eyebrow="ROL ADMINISTRADOR" title="Panel de administración" description="Funciones de gestión disponibles para el rol Administrador en modo de demostración." />
    <div className="surface-panel p-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"><div><h2 className="h4">Administrar productos</h2><p className="text-secondary mb-0">Crear, consultar, editar y eliminar artículos con persistencia local.</p></div><Link className="btn btn-warning fw-semibold" to="/administracion/productos">Abrir gestión de productos →</Link></div>
    <div className="surface-panel p-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"><div><h2 className="h4">Revisar pedidos</h2><p className="text-secondary mb-0">Historial y avance de solicitudes locales de demostración.</p></div><Link className="btn btn-warning fw-semibold" to="/administracion/pedidos">Abrir pedidos →</Link></div>
    <div className="surface-panel p-4 mb-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3"><div><h2 className="h4">Gestionar usuarios y roles</h2><p className="text-secondary mb-0">Crear, editar, desactivar y reactivar usuarios ficticios, con roles Cliente, Vendedor y Administrador.</p></div><Link className="btn btn-warning fw-semibold" to="/administracion/usuarios">Administrar usuarios →</Link></div>
    <p className="text-secondary small">Los reportes financieros y la autenticación segura con Spring Boot siguen pendientes para la solución final.</p>
  </section>;
}
