import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { canAccessRole } from '../utils/roles.js';

/** Guardia de interfaz para la DEMOSTRACIÓN. No sustituye permisos del backend. */
export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/ingresar" state={{ from: location }} replace />;
  if (!canAccessRole(user.role, allowedRoles)) {
    return <Navigate to="/sin-acceso" replace />;
  }
  return <Outlet />;
}
