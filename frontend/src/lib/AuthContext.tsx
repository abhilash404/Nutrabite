'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import API from './api';

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>;
  register: (userData: User) => Promise<boolean>;
  logout: () => void;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nutrabite-user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } 
      catch (e) { console.error('Failed to parse user session'); }
    }
    setIsLoaded(true);
  }, []);

  const login = async (email: string) => {
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('nutrabite-user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (e) { console.error(e); return false; }
  };

  const register = async (userData: User) => {
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('nutrabite-user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (e) { console.error(e); return false; }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nutrabite-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoaded }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}