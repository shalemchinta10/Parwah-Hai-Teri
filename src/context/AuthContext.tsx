import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    email: string,
    pass: string,
    username: string,
    fullName?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<UserProfile>) => void;
  toggleAnonymousDefault: () => void;
  deleteAccount: () => void;
  setShowAuthModal: (show: boolean, mode?: 'login' | 'signup') => void;
  showAuthModal: boolean;
  authModalMode: 'login' | 'signup';
  ensureAuth: (actionDescription?: string) => boolean;
  authPromptReason: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('parwah_user') || localStorage.getItem('sahay_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModalState] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [authPromptReason, setAuthPromptReason] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('parwah_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('parwah_user');
      localStorage.removeItem('sahay_user');
    }
  }, [currentUser]);

  const setShowAuthModal = (show: boolean, mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    if (!show) {
      setAuthPromptReason(null);
    }
    setShowAuthModalState(show);
  };

  const ensureAuth = (actionDescription?: string): boolean => {
    if (currentUser) return true;
    setAuthPromptReason(actionDescription || 'sharing or interacting with community content');
    setShowAuthModal(true, 'login');
    return false;
  };

  const loginAsDemo = () => {
    setCurrentUser(INITIAL_USER);
    setShowAuthModalState(false);
    setAuthPromptReason(null);
  };

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    // Simulate auth network latency (or Firebase auth trigger)
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const usernamePart = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
    const loggedInUser: UserProfile = {
      ...INITIAL_USER,
      email,
      username: `@${usernamePart}`,
    };

    setCurrentUser(loggedInUser);
    setShowAuthModalState(false);
    return { success: true };
  };

  const signup = async (
    email: string,
    pass: string,
    username: string,
    fullName?: string
  ) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);

    const cleanUsername = username.startsWith('@') ? username : `@${username.trim()}`;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      username: cleanUsername,
      fullName: fullName || '',
      email,
      isAnonymousDefault: false,
      joinedDate: new Date().toISOString().split('T')[0],
      savedPostIds: [],
      blockedUserIds: [],
      role: 'user',
    };

    setCurrentUser(newUser);
    setShowAuthModalState(false);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const forgotPassword = async (email: string) => {
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      message: `Password reset link sent to ${email}. Please check your inbox.`,
    };
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
  };

  const toggleAnonymousDefault = () => {
    if (!currentUser) return;
    updateProfile({ isAnonymousDefault: !currentUser.isAnonymousDefault });
  };

  const deleteAccount = () => {
    setCurrentUser(null);
    localStorage.removeItem('parwah_user');
    localStorage.removeItem('sahay_user');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        signup,
        loginAsDemo,
        logout,
        forgotPassword,
        updateProfile,
        toggleAnonymousDefault,
        deleteAccount,
        setShowAuthModal,
        showAuthModal,
        authModalMode,
        ensureAuth,
        authPromptReason,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
