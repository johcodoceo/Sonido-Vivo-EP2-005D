import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { createUser, editUser, readUsers, saveUsers, toggleUser } from '../services/userRepository.js';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [users, setUsers] = useState(readUsers);
  const [storageError, setStorageError] = useState('');

  const apply = useCallback((produce) => {
    const outcome = produce(users);
    if (outcome.error) return outcome;
    try {
      saveUsers(outcome.users);
      setUsers(outcome.users);
      setStorageError('');
      return outcome;
    } catch {
      const error = 'No se pudieron guardar los usuarios. Revisa el almacenamiento del navegador.';
      setStorageError(error);
      return { error, errors: {}, users };
    }
  }, [users]);

  const registerClient = useCallback((values) => apply((current) => createUser(current, values, new Date().toISOString(), { publicRegistration: true })), [apply]);
  const createAccount = useCallback((values) => apply((current) => createUser(current, values, new Date().toISOString())), [apply]);
  const updateAccount = useCallback((id, values, actorId) => apply((current) => editUser(current, id, values, actorId)), [apply]);
  const toggleAccount = useCallback((id, actorId) => apply((current) => toggleUser(current, id, actorId)), [apply]);
  const value = useMemo(() => ({ users, storageError, registerClient, createAccount, updateAccount, toggleAccount }),
    [users, storageError, registerClient, createAccount, updateAccount, toggleAccount]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUsers debe utilizarse dentro de UserProvider');
  return context;
}
