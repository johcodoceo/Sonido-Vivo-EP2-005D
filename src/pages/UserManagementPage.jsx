import { useMemo, useState } from 'react';
import PageIntro from '../components/PageIntro.jsx';
import UserForm from '../components/UserForm.jsx';
import { useUsers } from '../context/UserContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ROLE_LABELS, ROLES } from '../utils/roles.js';

export default function UserManagementPage() {
  const { users, createAccount, updateAccount, toggleAccount, storageError } = useUsers();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const editing = users.find((item) => item.id === editingId);
  const filtered = useMemo(() => users.filter((person) => (
    (!search.trim() || `${person.name} ${person.email} ${person.id}`.toLowerCase().includes(search.trim().toLowerCase())) &&
    (!roleFilter || person.role === roleFilter) &&
    (!statusFilter || (statusFilter === 'activo' ? person.active : !person.active))
  )).sort((a, b) => a.name.localeCompare(b.name, 'es')), [users, search, roleFilter, statusFilter]);

  function beginNew() { setEditingId(null); setShowForm(true); setMessage(''); setActionError(''); }
  function beginEdit(id) { setEditingId(id); setShowForm(true); setMessage(''); setActionError(''); }
  function save(values) {
    const result = editing ? updateAccount(editing.id, values, user.id) : createAccount(values);
    if (!result.error) {
      setShowForm(false); setEditingId(null); setMessage(editing ? 'Datos de usuario actualizados.' : 'Perfil de prueba creado.'); setActionError('');
    }
    return result;
  }
  function changeActive(person) {
    const action = person.active ? 'desactivar' : 'reactivar';
    if (!window.confirm(`¿Confirmas ${action} el perfil de ${person.name}?`)) return;
    const result = toggleAccount(person.id, user.id);
    if (result.error) { setActionError(result.error); setMessage(''); }
    else { setActionError(''); setMessage(`Cuenta ${person.active ? 'desactivada' : 'reactivada'} correctamente.`); }
  }

  return <section className="container section-space">
    <PageIntro eyebrow="ADMINISTRACIÓN · ETAPA 5" title="Gestión de usuarios" description="Crea, edita, desactiva y asigna roles a perfiles ficticios de la tienda. Todos los cambios se guardan localmente." />
    <div className="alert alert-warning" role="note"><strong>Datos ficticios:</strong> los roles y perfiles son una simulación del frontend, no seguridad de producción. No introduzcas información personal ni contraseñas.</div>
    {storageError && <div className="alert alert-danger" role="alert">{storageError}</div>}
    {actionError && <div className="alert alert-danger" role="alert">{actionError}</div>}
    {message && <div className="alert alert-success" role="status">{message}</div>}
    <div className="surface-panel p-3 p-md-4 mb-4">
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3"><div><h2 className="h4 mb-1">Perfiles registrados</h2><p className="text-secondary small mb-0">{users.length} perfiles · {users.filter((item) => item.active).length} activos</p></div><button type="button" className="btn btn-warning fw-semibold" onClick={beginNew}>+ Crear usuario</button></div>
      <div className="row g-2 mb-3"><div className="col-md-5"><label htmlFor="user-search" className="form-label small fw-semibold">Buscar usuario</label><input id="user-search" className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nombre, correo o código" /></div><div className="col-md-4"><label htmlFor="user-role-filter" className="form-label small fw-semibold">Filtrar por rol</label><select id="user-role-filter" className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}><option value="">Todos los roles</option>{Object.values(ROLES).map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}</select></div><div className="col-md-3"><label htmlFor="user-status-filter" className="form-label small fw-semibold">Estado</label><select id="user-status-filter" className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">Todos</option><option value="activo">Activos</option><option value="inactivo">Inactivos</option></select></div></div>
      <div className="table-responsive"><table className="table table-hover align-middle"><thead><tr><th scope="col">Nombre</th><th scope="col">Correo</th><th scope="col">Rol</th><th scope="col">Estado</th><th scope="col">Acciones</th></tr></thead><tbody>{filtered.map((person) => <tr key={person.id}><td><strong>{person.name}</strong><small className="d-block text-secondary">{person.id}</small></td><td className="user-email-cell">{person.email}</td><td>{ROLE_LABELS[person.role]}</td><td><span className={`badge ${person.active ? 'text-bg-success' : 'text-bg-secondary'}`}>{person.active ? 'Activo' : 'Inactivo'}</span></td><td><div className="d-flex flex-wrap gap-2"><button className="btn btn-outline-primary btn-sm" onClick={() => beginEdit(person.id)} type="button">Editar</button><button className={`btn btn-sm ${person.active ? 'btn-outline-danger' : 'btn-outline-success'}`} onClick={() => changeActive(person)} type="button" disabled={person.id === user.id && person.active}>{person.active ? 'Desactivar' : 'Reactivar'}</button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <p role="status" className="text-secondary text-center py-3">No hay usuarios con esos filtros.</p>}</div>
    </div>
    {showForm && <div className="surface-panel p-3 p-md-4" aria-labelledby="user-form-title"><h2 id="user-form-title" className="h4 mb-2">{editing ? `Editar: ${editing.name}` : 'Nuevo usuario'}</h2><p className="small text-secondary">Los campos marcados con * son obligatorios. Solo el Administrador puede asignar roles.</p><UserForm key={editingId ?? 'nuevo'} initial={editing ?? undefined} editingId={editing?.id ?? null} existing={users} onSave={save} onCancel={() => { setShowForm(false); setEditingId(null); }} submitLabel={editing ? 'Guardar cambios' : 'Crear perfil de prueba'}/></div>}
  </section>;
}
