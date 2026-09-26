'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { mockUsers } from '@/lib/mockData';
import { 
  getActiveSession, 
  loginUser, 
  registerUser, 
  updateUserProfile, 
  logoutUser, 
  RegisterPayload,
  findUserById
} from '@/lib/userStore';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionToken: string | null;
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  switchRole: (role: UserRole) => void;
  updateUserSettings: (settings: Partial<User>) => void;
  login: (emailOrPhone: string, password?: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.user);
  const [currentRole, setCurrentRole] = useState<UserRole>('user');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Restore session from persistent localStorage on initial mount
  useEffect(() => {
    try {
      const session = getActiveSession();
      if (session.user) {
        setCurrentUser(session.user);
        setCurrentRole(session.role || session.user.role || 'user');
        setIsAuthenticated(Boolean(session.token));
        setSessionToken(session.token);
      }
    } catch (err) {
      console.error('Failed to restore authentication session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const switchRole = useCallback((role: UserRole) => {
    setCurrentRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('safecircle_role', role);
    }

    // Check if we have an active user for this role or update current user's role
    setCurrentUser(prev => {
      const updated = { ...prev, role };
      if (prev.id) {
        updateUserProfile(prev.id, { role });
      }
      return updated;
    });
  }, []);

  const updateUserSettings = useCallback((settings: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...settings };
      if (prev.id) {
        updateUserProfile(prev.id, settings);
      }
      return updated;
    });

    if (settings.role) {
      setCurrentRole(settings.role);
    }
  }, []);

  const login = useCallback(
    async (emailOrPhone: string, password?: string, role?: UserRole): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        const result = loginUser(emailOrPhone, password, role);
        if (result.success && result.user) {
          setCurrentUser(result.user);
          setCurrentRole(result.user.role);
          setSessionToken(result.token || null);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { success: false, error: result.error || 'Login failed. Please verify credentials.' };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'An unexpected error occurred during login.' };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const signup = useCallback(
    async (payload: RegisterPayload): Promise<{ success: boolean; error?: string; user?: User }> => {
      setIsLoading(true);
      try {
        const result = registerUser(payload);
        if (result.success && result.user) {
          setCurrentUser(result.user);
          setCurrentRole(result.user.role);
          setSessionToken(result.token || null);
          setIsAuthenticated(true);
          return { success: true, user: result.user };
        } else {
          return { success: false, error: result.error || 'Failed to complete registration.' };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'An unexpected error occurred during signup.' };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    logoutUser();
    setIsAuthenticated(false);
    setSessionToken(null);
    // Reset to demo fallback so unauthenticated views still render safely
    setCurrentUser(mockUsers.user);
    setCurrentRole('user');
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        isLoading,
        sessionToken,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        switchRole,
        updateUserSettings,
        login,
        signup,
        logout,
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
