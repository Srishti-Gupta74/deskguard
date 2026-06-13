import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Student, AuthUser } from '../types';
import { upsertStudent } from '../lib/db';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginStudent: (rollNumber: string, name: string) => Promise<void>;
  loginAdmin: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'deskguard2024';

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  loginStudent: async () => {},
  loginAdmin: async () => {},
  logout: () => {},
});

const AUTH_STORAGE_KEY = 'dg_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const loginStudent = useCallback(async (rollNumber: string, name: string) => {
    const roll = rollNumber.trim().toUpperCase();
    const trimmedName = name.trim();
    if (!roll || !trimmedName) throw new Error('Roll number and name are required.');
    const student: Student = await upsertStudent(roll, trimmedName);
    const authUser: AuthUser = { role: 'student', student };
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  }, []);

  const loginAdmin = useCallback(async (username: string, password: string) => {
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      throw new Error('Invalid admin credentials.');
    }
    const authUser: AuthUser = { role: 'admin', isAdmin: true };
    setUser(authUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginStudent, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
