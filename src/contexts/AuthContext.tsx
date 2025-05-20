
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'pending' | 'active';
  createdAt: Date;
  accessLevel?: 'basic' | 'full' | 'limited';
}

// Auth context type
type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isAdmin: () => boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample admin user (would normally be stored in a database)
const adminUser: User = {
  id: '1',
  email: 'msartini@gmail.com',
  name: 'Administrador',
  role: 'admin',
  status: 'active',
  createdAt: new Date(),
  accessLevel: 'full',
};

// Mock users for the demo (would be stored in a database)
const initialUsers: User[] = [adminUser];

// Mock password store - in a real app this would be hashed and stored securely
const userPasswords: Record<string, string> = {
  'msartini@gmail.com': '123456',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Simulate checking local storage for saved session
  useEffect(() => {
    const savedUser = localStorage.getItem('cuidarUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Get user from store
      const foundUser = usersStore.getUserByEmail(email);
      if (!foundUser) {
        toast.error('Usuário não encontrado');
        return false;
      }
      
      // Check if user is active
      if (foundUser.status !== 'active') {
        toast.error('Usuário pendente de aprovação');
        return false;
      }
      
      // Check password
      const storedPassword = userPasswords[email];
      if (!storedPassword || storedPassword !== password) {
        toast.error('Credenciais inválidas');
        return false;
      }
      
      setCurrentUser(foundUser);
      localStorage.setItem('cuidarUser', JSON.stringify(foundUser));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cuidarUser');
    toast.info('Você saiu do sistema');
  };

  // Password reset function
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const foundUser = usersStore.getUserByEmail(email);
      if (!foundUser) {
        toast.error('Email não encontrado');
        return false;
      }
      
      // In a real app, would send a reset email
      toast.success('Instruções para redefinição de senha enviadas para seu email');
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Erro ao processar solicitação');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update password function
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      
      if (!currentUser) {
        toast.error('Nenhum usuário logado');
        return false;
      }
      
      // Check current password
      const storedPassword = userPasswords[currentUser.email];
      if (!storedPassword || storedPassword !== currentPassword) {
        toast.error('Senha atual incorreta');
        return false;
      }
      
      // Update password in mock store
      userPasswords[currentUser.email] = newPassword;
      toast.success('Senha atualizada com sucesso');
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      toast.error('Erro ao atualizar senha');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    forgotPassword,
    updatePassword,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// For accessing the mock users in the app
export const usersStore = {
  users: [...initialUsers],
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => {
    // Check if email already exists
    const existingUser = usersStore.getUserByEmail(user.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      ...user,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    // Store the password (in a real app this would be hashed)
    if ('password' in user && user.password) {
      userPasswords[user.email] = user.password as string;
    }
    
    usersStore.users.push(newUser);
    return newUser;
  },
  updateUser: (id: string, userData: Partial<User>) => {
    const index = usersStore.users.findIndex(user => user.id === id);
    if (index !== -1) {
      // Update user data
      usersStore.users[index] = { ...usersStore.users[index], ...userData };
      
      // Update password if provided
      if ('password' in userData && userData.password) {
        userPasswords[usersStore.users[index].email] = userData.password as string;
      }
      
      return true;
    }
    return false;
  },
  deleteUser: (id: string) => {
    const index = usersStore.users.findIndex(user => user.id === id);
    if (index !== -1) {
      // Remove password entry
      delete userPasswords[usersStore.users[index].email];
      
      // Remove user
      usersStore.users.splice(index, 1);
      return true;
    }
    return false;
  },
  getUserById: (id: string) => {
    return usersStore.users.find(user => user.id === id) || null;
  },
  getUserByEmail: (email: string) => {
    return usersStore.users.find(user => user.email === email) || null;
  },
  getUsers: () => {
    return [...usersStore.users];
  },
};
