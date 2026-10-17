import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLES, ROLE_LABELS } from '../utils/roles.js';
import Brand from './Brand.jsx';
import { useOptionalCart } from '../context/CartContext.jsx';

const commonLinks = [
  { to: '/inicio', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/ubicaciones', label: 'Ubicaciones' },
];

function getNavigation(role) {
  const links = [...commonLinks];
  if ([ROLES.CLIENTE, ROLES.ADMIN].includes(role)) {
    links.push({ to: '/carrito', label: 'Carrito' });
    links.push({ to: '/mis-pedidos', label: 'Mis pedidos' });
  }
  if ([ROLES.VENDEDOR, ROLES.ADMIN].includes(role)) { links.push({ to: '/vendedor', label: 'Vendedor' }); links.push({ to: '/vendedor/pedidos', label: 'Gestionar pedidos' }); }
  if (role === ROLES.ADMIN) { links.push({ to: '/administracion', label: 'Administración' }); links.push({ to: '/administracion/usuarios', label: 'Usuarios' }); }
  return links;
}

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const cart = useOptionalCart();

  function closeMenu() { setExpanded(false); }
  function handleLogout() {
    logout();
    closeMenu();
    navigate('/ingresar', { replace: true });
  }

  return (
    <header className="site-header sticky-top">
      <nav className="navbar navbar-expand-lg container py-3" aria-label="Navegación principal">
        <Brand light />
        <button className="navbar-toggler menu-toggle ms-auto" type="button" aria-label="Abrir o cerrar menú" aria-expanded={expanded} aria-controls="menu-principal" onClick={() => setExpanded((value) => !value)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div id="menu-principal" className={`collapse navbar-collapse ${expanded ? 'show' : ''}`}>
          <ul className="navbar-nav mx-lg-auto gap-lg-1 my-3 my-lg-0">
            {getNavigation(user.role).map(({ to, label }) => (
              <li className="nav-item" key={to}>
                <NavLink to={to} onClick={closeMenu} className={({ isActive }) => `nav-link top-nav-link px-3 ${isActive ? 'active' : ''}`}>
                  {label}{to === '/carrito' && cart?.count > 0 && <span className="badge text-bg-warning ms-2" aria-label={`${cart.count} unidades en el carrito`}>{cart.count}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2 gap-lg-3">
            <span className="role-pill" title={user.name}>{user.name} · {ROLE_LABELS[user.role]} · demo</span>
            <button className="btn btn-outline-light btn-sm px-3" type="button" onClick={handleLogout}>Salir</button>
          </div>
        </div>
      </nav>
    </header>
  );
}
