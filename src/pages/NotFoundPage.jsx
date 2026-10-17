import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Brand from '../components/Brand.jsx';

export default function NotFoundPage() {
  const { user } = useAuth();
  return (
    <main className="login-screen min-vh-100 d-flex align-items-center py-5">
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="mb-4"><Brand light to={user ? '/inicio' : '/ingresar'} /></div>
        <div className="login-panel"><div className="eyebrow mb-2">ERROR 404</div><h1 className="h2 fw-bold">Página no encontrada</h1><p className="text-secondary">La dirección que intentaste abrir no existe en Sonido Vivo.</p><Link className="btn btn-warning" to={user ? '/inicio' : '/ingresar'}>Volver</Link></div>
      </div>
    </main>
  );
}
