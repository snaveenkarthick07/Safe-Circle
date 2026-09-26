'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/lib/mockData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  updateUserSettings: (settings: Partial<User>) => void;
  login: (email: string, role?: UserRole) => void;
  signup: (userData: Partial<User> & { name: string; email: string; role?: UserRole }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.user);
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    // Load persisted role if any
    const savedRole = localStorage.getItem('safecircle_role') as UserRole;
    if (savedRole && mockUsers[savedRole]) {
      setCurrentRole(savedRole);
      setCurrentUser(mockUsers[savedRole]);
    }
  }, []);

  const switchRole = (role: UserRole) => {
    if (mockUsers[role]) {
      setCurrentRole(role);
      setCurrentUser(mockUsers[role]);
      localStorage.setItem('safecircle_role', role);
    }
  };

  const updateUserSettings = (settings: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...settings }));
  };

  const login = (email: string, role: UserRole = 'user') => {
    setIsAuthenticated(true);
    switchRole(role);
  };

  const signup = (userData: Partial<User> & { name: string; email: string; role?: UserRole }) => {
    setIsAuthenticated(true);
    setCurrentUser(prev => ({
      ...prev,
      ...userData,
      id: `usr_${Date.now()}`,
    }));
    if (userData.role) {
      switchRole(userData.role);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        switchRole,
        updateUserSettings,
        login,
        signup,
        logout,
        isAuthenticated,
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
