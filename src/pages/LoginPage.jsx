import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES } from '../utils/roles.js';
import Brand from '../components/Brand.jsx';

const profiles = [
  { role: ROLES.CLIENTE, title: 'Cliente', detail: 'Explora la tienda y las vistas de compra.', icon: '🎧' },
  { role: ROLES.VENDEDOR, title: 'Vendedor', detail: 'Accede al área de gestión de tienda.', icon: '🎛️' },
  { role: ROLES.ADMIN, title: 'Administrador', detail: 'Revisa los módulos de administración.', icon: '🎼' },
];

export default function LoginPage() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to="/inicio" replace />;

  function handleLogin(role) {
    loginDemo(role);
    const from = location.state?.from?.pathname;
    // Solo redirigimos a inicio para evitar destinos incompatibles con el rol.
    navigate(from && ['/inicio', '/catalogo', '/ubicaciones'].includes(from) ? from : '/inicio', { replace: true });
  }

  return (
    <main className="login-screen min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6 login-info">
            <Brand light to="/ingresar" />
            <div className="eyebrow mt-5 mb-3">TIENDA MUSICAL · VIÑA DEL MAR</div>
            <h1 className="display-4 fw-bold mb-3">Que tu próxima idea <span className="gradient-text">suene en grande.</span></h1>
            <p className="fs-5 login-description mb-4">Sonido Vivo: instrumentos, equipos de sonido y accesorios para músicos.</p>
            <div className="login-points"><span>Instrumentos</span><span>Audio</span><span>Accesorios</span></div>
          </div>
          <div className="col-lg-6">
            <section className="login-panel" aria-labelledby="acceso-title">
              <div className="eyebrow mb-2">ETAPA 1 · ACCESO DE PRUEBA</div>
              <h2 id="acceso-title" className="h3 fw-bold mb-2">Explora el proyecto</h2>
              <p className="text-secondary mb-4">Selecciona un rol para revisar la navegación inicial. No se verifican contraseñas ni existe autenticación real en esta etapa.</p>
              <div className="d-grid gap-3">
                {profiles.map(({ role, title, detail, icon }) => (
                  <button key={role} className="profile-button text-start" type="button" onClick={() => handleLogin(role)}>
                    <span className="profile-icon" aria-hidden="true">{icon}</span>
                    <span className="flex-grow-1"><strong className="d-block">Entrar como {title}</strong><small className="text-secondary">{detail}</small></span>
                    <span className="text-primary-emphasis fw-bold" aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
              <div className="small text-secondary mt-4 pt-3 border-top">¿Buscabas crear una cuenta? <Link to="/registro">Ver pantalla de registro</Link></div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
