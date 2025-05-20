
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'pending' | 'active';
  createdAt: Date;
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
};

// Mock users for the demo (would be stored in a database)
const initialUsers: User[] = [adminUser];

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
      
      // Validate admin credentials for demo purposes
      if (email === 'msartini@gmail.com' && password === '123456') {
        setCurrentUser(adminUser);
        localStorage.setItem('cuidarUser', JSON.stringify(adminUser));
        return true;
      }
      
      // In a real app, would check other users in the database
      toast.error('Credenciais inválidas');
      return false;
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
      
      // In a real app, would send a reset email
      if (email === 'msartini@gmail.com') {
        toast.success('Instruções para redefinição de senha enviadas para seu email');
        return true;
      }
      
      toast.error('Email não encontrado');
      return false;
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
      
      // In a real app, would verify current password and update
      if (currentPassword === '123456') {
        // Update the password in a real system
        toast.success('Senha atualizada com sucesso');
        return true;
      }
      
      toast.error('Senha atual incorreta');
      return false;
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
    const newUser: User = {
      ...user,
      id: (usersStore.users.length + 1).toString(),
      createdAt: new Date(),
    };
    usersStore.users.push(newUser);
    return newUser;
  },
  updateUser: (id: string, userData: Partial<User>) => {
    const index = usersStore.users.findIndex(user => user.id === id);
    if (index !== -1) {
      usersStore.users[index] = { ...usersStore.users[index], ...userData };
      return true;
    }
    return false;
  },
  deleteUser: (id: string) => {
    const index = usersStore.users.findIndex(user => user.id === id);
    if (index !== -1) {
      usersStore.users.splice(index, 1);
      return true;
    }
    return false;
  },
  getUserById: (id: string) => {
    return usersStore.users.find(user => user.id === id) || null;
  },
  getUsers: () => {
    return [...usersStore.users];
  },
};
