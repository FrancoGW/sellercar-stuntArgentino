import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

type User = { id: string; email: string; name?: string; role: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  setUser: (u: User | null) => void;
  setToken: (t: string | null) => void;
};

const STORAGE_KEY = 'sellercar_token';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [loading, setLoading] = useState(true);

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem(STORAGE_KEY, t);
    else localStorage.removeItem(STORAGE_KEY);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch('/auth/session', { token })
      .then((res) => {
        if (!res.ok) {
          setToken(null);
          setUser(null);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
        else setToken(null);
      })
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, [token, setToken]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data?.message || 'Credenciales incorrectas' };
    }
    if (data?.token) {
      setToken(data.token);
      setUser(data.user ?? null);
      return { ok: true };
    }
    return { ok: false, error: 'Respuesta inválida' };
  }, [setToken]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
