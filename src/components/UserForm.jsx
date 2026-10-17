import { useState } from 'react';
import { ROLES, ROLE_LABELS } from '../utils/roles.js';
import { validateUser } from '../services/userRepository.js';

export const EMPTY_USER = { name: '', email: '', phone: '', role: ROLES.CLIENTE };

/** Formulario común entre registro público y administración. Datos SOLO ficticios. */
export default function UserForm({ initial = EMPTY_USER, existing = [], editingId = null, publicRegistration = false, onSave, onCancel, submitLabel = 'Guardar usuario' }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_USER, ...initial }));
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setGeneralError('');
  };
  function submit(event) {
    event.preventDefault();
    if (saving) return;
    const result = validateUser(form, existing, editingId, { publicRegistration });
    setErrors(result.errors);
    if (Object.keys(result.errors).length) { setGeneralError('Corrige los campos señalados.'); return; }
    setSaving(true);
    const outcome = onSave(result.data);
    if (outcome?.error) {
      setGeneralError(outcome.error);
      setErrors(outcome.errors ?? {});
      setSaving(false);
    }
  }
  return <form onSubmit={submit} noValidate aria-label={publicRegistration ? 'Registro de cliente' : 'Formulario de usuario'}>
    <div className="row g-3">
      <div className="col-md-6"><label htmlFor="user-name" className="form-label fw-semibold">Nombre completo *</label><input id="user-name" value={form.name} onChange={(e) => update('name', e.target.value)} className={`form-control ${errors.name ? 'is-invalid' : ''}`} maxLength={80} autoComplete="off" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'user-name-error' : undefined}/>{errors.name && <div id="user-name-error" className="invalid-feedback">{errors.name}</div>}</div>
      <div className="col-md-6"><label htmlFor="user-email" className="form-label fw-semibold">Correo electrónico *</label><input id="user-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className={`form-control ${errors.email ? 'is-invalid' : ''}`} maxLength={130} autoComplete="off" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'user-email-error' : undefined}/>{errors.email && <div id="user-email-error" className="invalid-feedback">{errors.email}</div>}</div>
      <div className="col-md-6"><label htmlFor="user-phone" className="form-label fw-semibold">Teléfono (opcional)</label><input id="user-phone" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} className={`form-control ${errors.phone ? 'is-invalid' : ''}`} maxLength={20} autoComplete="off" placeholder="Ej.: +56 9 1111 2222" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'user-phone-error' : undefined}/>{errors.phone && <div id="user-phone-error" className="invalid-feedback">{errors.phone}</div>}</div>
      {!publicRegistration && <div className="col-md-6"><label htmlFor="user-role" className="form-label fw-semibold">Rol *</label><select id="user-role" className={`form-select ${errors.role ? 'is-invalid' : ''}`} value={form.role} onChange={(e) => update('role', e.target.value)} aria-invalid={!!errors.role}>{Object.values(ROLES).map((role) => <option key={role} value={role}>{ROLE_LABELS[role]}</option>)}</select>{errors.role && <div className="invalid-feedback">{errors.role}</div>}</div>}
      {publicRegistration && <div className="col-12"><p className="small text-secondary mb-0">Las cuentas creadas por registro público reciben únicamente el rol Cliente.</p></div>}
      {generalError && <div className="col-12"><div role="alert" className="alert alert-danger mb-0">{generalError}</div></div>}
      <div className="col-12 d-flex flex-wrap gap-2"><button className="btn btn-warning fw-semibold" type="submit" disabled={saving}>{saving ? 'Guardando…' : submitLabel}</button>{onCancel && <button className="btn btn-outline-secondary" type="button" onClick={onCancel}>Cancelar</button>}</div>
    </div>
  </form>;
}
