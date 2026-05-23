import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('smartcrm_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smartcrm_token');
    if (!token) {
      setBooting(false);
      return;
    }

    authApi
      .me()
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        localStorage.setItem('smartcrm_user', JSON.stringify(freshUser));
      })
      .catch(() => {
        localStorage.removeItem('smartcrm_token');
        localStorage.removeItem('smartcrm_user');
        setUser(null);
      })
      .finally(() => setBooting(false));
  }, []);

  const authenticate = async (mode, payload) => {
    const response = mode === 'register' ? await authApi.register(payload) : await authApi.login(payload);
    localStorage.setItem('smartcrm_token', response.token);
    localStorage.setItem('smartcrm_user', JSON.stringify(response.user));
    setUser(response.user);
    toast.success(`Welcome, ${response.user.name}`);
  };

  const logout = () => {
    localStorage.removeItem('smartcrm_token');
    localStorage.removeItem('smartcrm_user');
    setUser(null);
    toast.success('Signed out');
  };

  const value = useMemo(() => ({ user, booting, authenticate, logout }), [user, booting]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
