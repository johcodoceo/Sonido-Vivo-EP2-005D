import { createContext, useContext, useMemo, useState } from 'react';
import { DEMO_NAMES, isValidRole } from '../utils/roles.js';

const SESSION_KEY = 'sonido-vivo-demo-session-v1';
const AuthContext = createContext(null);

function readDemoSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !isValidRole(parsed.role) || parsed.demo !== true) return null;
    return { id: `demo-${parsed.role}`, role: parsed.role, name: DEMO_NAMES[parsed.role], demo: true };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readDemoSession);

  function loginDemo(role) {
    if (!isValidRole(role)) throw new Error('Rol de demostración no válido');
    const nextUser = { id: `demo-${role}`, role, name: DEMO_NAMES[role], demo: true };
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(nextUser)); } catch { /* Sin almacenamiento disponible */ }
    setUser(nextUser);
  }

  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* Sin almacenamiento disponible */ }
    setUser(null);
  }

  const value = useMemo(() => ({ user, loginDemo, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return value;
}
