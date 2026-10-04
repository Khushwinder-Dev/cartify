'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage and verify with backend
  useEffect(() => {
    async function initAuth() {
      if (typeof window === 'undefined') return;

      const storedToken = localStorage.getItem('customer_token');
      const storedUser = localStorage.getItem('customer_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);

          // Verify token validity in background
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            const meUser = data.data || data;
            setUser(meUser);
            localStorage.setItem('customer_user', JSON.stringify(meUser));
          } else {
            // Token expired or invalid
            localStorage.removeItem('customer_token');
            localStorage.removeItem('customer_user');
            setUser(null);
            setToken(null);
          }
        } catch {
          // Keep cached user if offline
        }
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const guestCartToken =
        typeof window !== 'undefined' ? localStorage.getItem('cart_token') : null;

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          guest_cart_token: guestCartToken || undefined,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        const errorMsg =
          responseData.errors?.email?.[0] ||
          responseData.errors?.password?.[0] ||
          responseData.message ||
          'Invalid credentials provided.';
        throw new Error(errorMsg);
      }

      const payload = responseData.data || responseData;
      const loggedUser = payload.user;
      const authToken = payload.token;

      if (!loggedUser || !authToken) {
        throw new Error('Authentication response was missing user or token.');
      }

      setUser(loggedUser);
      setToken(authToken);

      localStorage.setItem('customer_token', authToken);
      localStorage.setItem('customer_user', JSON.stringify(loggedUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        const errorMsg =
          responseData.errors?.email?.[0] ||
          responseData.errors?.password?.[0] ||
          responseData.errors?.name?.[0] ||
          responseData.message ||
          'Failed to create account.';
        throw new Error(errorMsg);
      }

      const payload = responseData.data || responseData;
      const registeredUser = payload.user;
      const authToken = payload.token;

      if (!registeredUser || !authToken) {
        throw new Error('Registration response was missing user or token.');
      }

      setUser(registeredUser);
      setToken(authToken);

      localStorage.setItem('customer_token', authToken);
      localStorage.setItem('customer_user', JSON.stringify(registeredUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null);

    if (currentToken) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
        });
      } catch {
        // ignore network error
      }
    }

    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customer_token');
      localStorage.removeItem('customer_user');
    }
  };

  const refreshUser = async () => {
    const currentToken = token || (typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null);
    if (!currentToken) return;

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const meUser = data.data || data;
        setUser(meUser);
        localStorage.setItem('customer_user', JSON.stringify(meUser));
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
