import React, { createContext, useContext, useEffect, useState } from 'react';
import { authStore, User } from '../services/auth';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  hasRole: (role: 'admin' | 'analyst' | 'viewer') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const st = authStore.load();
    setUser(st.currentUser);
  }, []);

  const login = async (username: string, password: string) => {
    const res = authStore.login(username, password);
    setUser(authStore.load().currentUser);
    return res;
  };

  const logout = () => { authStore.logout(); setUser(null); };

  const hasRole = (role: 'admin' | 'analyst' | 'viewer') => !!user?.roles.includes(role);

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};



