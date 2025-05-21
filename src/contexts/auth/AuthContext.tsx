
import React, { createContext, useContext } from 'react';
import { useAuthProvider } from './useAuthProvider';
import { AuthContextType } from './types';
import { User } from '@/types/user';

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider();
  
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { User, AuthContextType };
