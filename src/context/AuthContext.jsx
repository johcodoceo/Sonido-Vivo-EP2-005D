import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useUsers } from './UserContext.jsx';
import { isValidRole } from '../utils/roles.js';

const SESSION_KEY = 'sonido-vivo-demo-session-v1';
const AuthContext = createContext(null);

function readDemoSessionId() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Se admiten las sesiones de Etapas 1-4, que solo guardaban el rol.
    if (parsed?.demo !== true) return null;
    if (typeof parsed.id === 'string') return parsed.id;
    return isValidRole(parsed.role) ? `demo-${parsed.role}` : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const { users } = useUsers();
  const [sessionId, setSessionId] = useState(readDemoSessionId);
  const user = useMemo(() => {
    const found = users.find((person) => person.id === sessionId && person.active);
    return found ? { id: found.id, name: found.name, email: found.email, role: found.role, demo: true } : null;
  }, [users, sessionId]);

  useEffect(() => {
    if (sessionId && !user) {
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Browser restringido */ }
      setSessionId(null);
    }
  }, [sessionId, user]);

  function loginProfile(id) {
    const found = users.find((person) => person.id === id && person.active);
    if (!found) throw new Error('La cuenta no existe o está desactivada.');
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: found.id, demo: true, role: found.role })); } catch { /* Demo sin persistencia de sesión */ }
    setSessionId(found.id);
  }
  function loginDemo(role) {
    if (!isValidRole(role)) throw new Error('Rol de demostración no válido');
    if (!users.some((person) => person.id === `demo-${role}` && person.role === role && person.active)) throw new Error('Este perfil ya no está disponible con el rol indicado.');
    loginProfile(`demo-${role}`);
  }
  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Browser restringido */ }
    setSessionId(null);
  }
  const value = useMemo(() => ({ user, loginProfile, loginDemo, logout }), [user, users]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return value;
}
