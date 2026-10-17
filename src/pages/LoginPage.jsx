import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useUsers } from '../context/UserContext.jsx';
import { ROLES, ROLE_LABELS } from '../utils/roles.js';
import Brand from '../components/Brand.jsx';

const profiles = [
  { role: ROLES.CLIENTE, title: 'Cliente', detail: 'Catálogo, carrito y pedidos.', icon: '🎧' },
  { role: ROLES.VENDEDOR, title: 'Vendedor', detail: 'Inventario y gestión de pedidos.', icon: '🎛️' },
  { role: ROLES.ADMIN, title: 'Administrador', detail: 'Productos, pedidos y usuarios.', icon: '🎼' },
];

export default function LoginPage() {
  const { user, loginDemo, loginProfile } = useAuth();
  const { users } = useUsers();
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState(() => location.state?.registered || '');
  const [error, setError] = useState('');
  if (user) return <Navigate to="/inicio" replace />;

  function finishLogin(fn) {
    try {
      fn();
      const from = location.state?.from?.pathname;
      navigate(from && ['/inicio', '/catalogo', '/ubicaciones'].includes(from) ? from : '/inicio', { replace: true });
    } catch (exception) { setError(exception.message); }
  }
  const customProfiles = users.filter((person) => person.active && !person.id.startsWith('demo-'));
  return <main className="login-screen min-vh-100 d-flex align-items-center py-5">
    <div className="container"><div className="row g-5 align-items-center">
      <div className="col-lg-6 login-info"><Brand light to="/ingresar"/><div className="eyebrow mt-5 mb-3">TIENDA MUSICAL · VIÑA DEL MAR</div><h1 className="display-4 fw-bold mb-3">Que tu próxima idea <span className="gradient-text">suene en grande.</span></h1><p className="fs-5 login-description mb-4">Sonido Vivo: instrumentos, equipos de sonido y accesorios para músicos.</p><div className="login-points"><span>Instrumentos</span><span>Audio</span><span>Accesorios</span></div></div>
      <div className="col-lg-6"><section className="login-panel" aria-labelledby="acceso-title">
        <div className="eyebrow mb-2">ETAPA 5 · ACCESO DE DEMOSTRACIÓN</div><h2 id="acceso-title" className="h3 fw-bold mb-2">Explora el proyecto</h2>
        <div className="demo-alert mb-4" role="note"><strong>Sin autenticación real:</strong> cualquiera que abra esta demostración puede seleccionar cualquier perfil. No ingreses datos personales ni contraseñas reales.</div>
        {location.state?.registered && <div className="alert alert-success" role="status">Perfil Cliente creado correctamente. Selecciónalo para entrar.</div>}
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="d-grid gap-3">{profiles.map(({ role, title, detail, icon }) => {
          const enabled = users.some((person) => person.id === `demo-${role}` && person.role === role && person.active);
          return <button key={role} disabled={!enabled} className="profile-button text-start" type="button" onClick={() => finishLogin(() => loginDemo(role))}><span className="profile-icon" aria-hidden="true">{icon}</span><span className="flex-grow-1"><strong className="d-block">Entrar como {title}</strong><small className="text-secondary">{enabled ? detail : 'Perfil desactivado'}</small></span><span className="text-primary-emphasis fw-bold" aria-hidden="true">→</span></button>;
        })}</div>
        {customProfiles.length > 0 && <form className="mt-4 pt-3 border-top" onSubmit={(e) => { e.preventDefault(); finishLogin(() => loginProfile(selected)); }}><label htmlFor="other-profile" className="form-label fw-semibold">Otros perfiles de prueba</label><select id="other-profile" value={selected} onChange={(e) => setSelected(e.target.value)} className="form-select mb-2" required><option value="">Selecciona una cuenta</option>{customProfiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name} — {ROLE_LABELS[profile.role]}</option>)}</select><button className="btn btn-outline-dark" type="submit" disabled={!selected}>Entrar con perfil seleccionado</button></form>}
        <div className="small text-secondary mt-4 pt-3 border-top">¿Quieres agregar un perfil Cliente? <Link to="/registro">Ir al registro</Link></div>
      </section></div>
    </div></div>
  </main>;
}
