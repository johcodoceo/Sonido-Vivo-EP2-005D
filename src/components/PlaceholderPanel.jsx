import { Link } from 'react-router-dom';

export default function PlaceholderPanel({ icon, title, text, points = [] }) {
  return (
    <div className="surface-panel p-4 p-md-5">
      <div className="empty-icon mb-3" aria-hidden="true">{icon}</div>
      <h2 className="h4 fw-bold">{title}</h2>
      <p className="text-secondary">{text}</p>
      {points.length > 0 && <ul className="check-grid">{points.map((point) => <li key={point}>{point}</li>)}</ul>}
      <Link className="btn btn-outline-dark mt-3" to="/inicio">Volver al inicio</Link>
    </div>
  );
}
