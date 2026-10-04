import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import api from '@/api/client';
import type { User, LoginDto, RegisterDto, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get<User>('/auth/me');
      setUser(res.data);
    } catch {
      setUser(null);
      localStorage.removeItem('access_token');
    }
  }, []);

  // On mount, check if user is already logged in via refresh token cookie
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };
    void init();
  }, [refreshUser]);

  const login = useCallback(async (data: LoginDto) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    localStorage.setItem('access_token', res.data.accessToken);
    setUser(res.data.user);
  }, []);

  const register = useCallback(async (data: RegisterDto) => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('access_token', res.data.accessToken);
    setUser(res.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
