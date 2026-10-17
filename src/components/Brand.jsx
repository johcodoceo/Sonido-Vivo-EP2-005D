import { Link } from 'react-router-dom';

export default function Brand({ to = '/inicio', light = false }) {
  return (
    <Link to={to} className={`brand text-decoration-none d-inline-flex align-items-center gap-2 ${light ? 'brand-light' : ''}`} aria-label="Sonido Vivo, ir al inicio">
      <span className="brand-icon" aria-hidden="true">SV</span>
      <span className="brand-name"><strong>SONIDO</strong><span>VIVO</span></span>
    </Link>
  );
}
