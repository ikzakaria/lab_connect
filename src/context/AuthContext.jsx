import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SEED_USERS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('labconnect_all_users');
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [pendingUsers, setPendingUsers] = useState(() => {
    const saved = localStorage.getItem('labconnect_pending_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [passwordResets, setPasswordResets] = useState(() => {
    const saved = localStorage.getItem('labconnect_password_resets');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('labconnect_user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    const current = allUsers.find(u => u.email === parsed.email);
    return current ? { ...current, ...parsed } : null;
  });

  useEffect(() => {
    localStorage.setItem('labconnect_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('labconnect_pending_users', JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  useEffect(() => {
    localStorage.setItem('labconnect_password_resets', JSON.stringify(passwordResets));
  }, [passwordResets]);

  const login = useCallback((email, password) => {
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('labconnect_user', JSON.stringify(found));
      return true;
    }
    return false;
  }, [allUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('labconnect_user');
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return null;
      const next = { ...prev, ...updates };
      localStorage.setItem('labconnect_user', JSON.stringify(next));
      return next;
    });
    setAllUsers(prev => prev.map(u => u.id === user?.id ? { ...u, ...updates } : u));
  }, [user]);

  const registerRequest = useCallback((name, email, password, role) => {
    const exists = allUsers.some(u => u.email === email) || pendingUsers.some(u => u.email === email);
    if (exists) return { ok: false, error: 'Cet email est déjà utilisé' };
    const req = { id: Date.now(), name, email, password, role, requestedAt: new Date().toISOString() };
    setPendingUsers(prev => [...prev, req]);
    return { ok: true };
  }, [allUsers, pendingUsers]);

  const requestPasswordReset = useCallback((email, newPassword) => {
    const exists = allUsers.some(u => u.email === email);
    if (!exists) return { ok: false, error: 'Aucun compte trouvé avec cet email' };
    const existsPending = passwordResets.some(r => r.email === email && r.status === 'pending');
    if (existsPending) return { ok: false, error: 'Une demande est déjà en cours pour cet email' };
    const req = { id: Date.now(), email, newPassword, requestedAt: new Date().toISOString(), status: 'pending' };
    setPasswordResets(prev => [...prev, req]);
    return { ok: true };
  }, [allUsers, passwordResets]);

  const approveUser = useCallback((pendingId) => {
    const req = pendingUsers.find(p => p.id === pendingId);
    if (!req) return;
    const newUser = { ...req, id: req.id };
    setAllUsers(prev => [...prev, newUser]);
    setPendingUsers(prev => prev.filter(p => p.id !== pendingId));
  }, [pendingUsers]);

  const rejectUser = useCallback((pendingId) => {
    setPendingUsers(prev => prev.filter(p => p.id !== pendingId));
  }, []);

  const approvePasswordReset = useCallback((resetId) => {
    const req = passwordResets.find(r => r.id === resetId);
    if (!req) return false;
    const pass = req.newPassword || 'temp1234';
    setAllUsers(prev => prev.map(u => u.email === req.email ? { ...u, password: pass } : u));
    setPasswordResets(prev => prev.filter(r => r.id !== resetId));
    return true;
  }, [passwordResets]);

  const rejectPasswordReset = useCallback((resetId) => {
    setPasswordResets(prev => prev.filter(r => r.id !== resetId));
  }, []);

  const deleteUser = useCallback((userId) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const addUser = useCallback((name, email, password, role) => {
    const exists = allUsers.some(u => u.email === email);
    if (exists) return { ok: false, error: 'Email déjà utilisé' };
    const newUser = { id: Date.now(), name, email, password, role };
    setAllUsers(prev => [...prev, newUser]);
    return { ok: true };
  }, [allUsers]);

  const value = useMemo(() => ({
    user, login, logout, updateUser,
    allUsers, pendingUsers, passwordResets,
    registerRequest, requestPasswordReset,
    approveUser, rejectUser, approvePasswordReset, rejectPasswordReset, deleteUser, addUser
  }), [user, login, logout, updateUser, allUsers, pendingUsers, passwordResets, registerRequest, requestPasswordReset, approveUser, rejectUser, approvePasswordReset, rejectPasswordReset, deleteUser, addUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
