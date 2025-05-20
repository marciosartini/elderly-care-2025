
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { usersStore } from '@/stores/userStore';
import { toast } from 'sonner';

export function useAuthProvider() {
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
      if (!usersStore.checkPassword(email, password)) {
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
      if (!usersStore.checkPassword(currentUser.email, currentPassword)) {
        toast.error('Senha atual incorreta');
        return false;
      }
      
      // Update password in store
      usersStore.updatePassword(currentUser.email, newPassword);
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

  return {
    currentUser,
    loading,
    login,
    logout,
    forgotPassword,
    updatePassword,
    isAdmin,
  };
}
