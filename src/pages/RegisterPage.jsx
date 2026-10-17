import { Link, useNavigate } from 'react-router-dom';
import Brand from '../components/Brand.jsx';
import UserForm from '../components/UserForm.jsx';
import { useUsers } from '../context/UserContext.jsx';

export default function RegisterPage() {
  const { users, registerClient, storageError } = useUsers();
  const navigate = useNavigate();
  function save(form) {
    const result = registerClient(form);
    if (!result.error) navigate('/ingresar', { replace: true, state: { registered: result.user.id } });
    return result;
  }
  return <main className="login-screen min-vh-100 d-flex align-items-center py-5">
    <div className="container" style={{ maxWidth: 760 }}>
      <div className="mb-4"><Brand light to="/ingresar" /></div>
      <section className="login-panel">
        <div className="eyebrow mb-2">ETAPA 5 · REGISTRO DE PRUEBA</div>
        <h1 className="h2 fw-bold">Crea un perfil Cliente</h1>
        <p className="text-secondary">El formulario valida nombre, correo único y teléfono opcional. El perfil se guarda únicamente en este navegador.</p>
        <div className="demo-alert mb-4" role="note"><strong>Demostración académica:</strong> utiliza datos ficticios. No se solicita contraseña; esta pantalla no crea una cuenta segura ni verifica la identidad.</div>
        {storageError && <div role="alert" className="alert alert-danger">{storageError}</div>}
        <UserForm publicRegistration existing={users} onSave={save} submitLabel="Crear perfil Cliente" />
        <p className="small text-secondary mt-4 mb-0">¿Ya tienes un perfil de prueba? <Link to="/ingresar">Ir al acceso</Link></p>
      </section>
    </div>
  </main>;
}
