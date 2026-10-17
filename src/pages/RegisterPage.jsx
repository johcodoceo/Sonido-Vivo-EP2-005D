import { Link } from 'react-router-dom';
import Brand from '../components/Brand.jsx';

export default function RegisterPage() {
  return (
    <main className="login-screen min-vh-100 d-flex align-items-center py-5">
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="mb-4"><Brand light to="/ingresar" /></div>
        <section className="login-panel">
          <div className="eyebrow mb-2">REGISTRO · PRÓXIMA ETAPA</div>
          <h1 className="h2 fw-bold">Registro de clientes</h1>
          <p className="text-secondary mb-4">La ruta de registro está preparada, pero el formulario, sus validaciones y la creación de usuarios se desarrollarán en la etapa de formularios y administración.</p>
          <p className="demo-alert mb-4">No introduzcas datos personales: esta versión solo demuestra la estructura y las rutas del frontend.</p>
          <Link className="btn btn-warning fw-semibold" to="/ingresar">Volver al acceso de prueba</Link>
        </section>
      </div>
    </main>
  );
}
