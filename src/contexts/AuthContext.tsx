import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/user';
import { supabase, cleanupAuthState } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Auth context type
export type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isAdmin: () => boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize Supabase auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (event === 'SIGNED_IN' && session) {
          try {
            // Fetch user profile from Supabase
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (error) throw error;
            
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.name || session.user.email?.split('@')[0] || '',
              role: (profile?.role as 'admin' | 'user') || 'user',
              status: (profile?.status as 'pending' | 'active') || 'pending',
              createdAt: profile?.created_at ? new Date(profile.created_at) : new Date(),
            };
            
            setCurrentUser(user);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch user profile from Supabase
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          
          const user: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.email?.split('@')[0] || '',
            role: (profile?.role as 'admin' | 'user') || 'user',
            status: (profile?.status as 'pending' | 'active') || 'pending',
            createdAt: profile?.created_at ? new Date(profile.created_at) : new Date(),
          };
          
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt to sign out globally first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (!data.user) {
        toast.error('Falha ao realizar login');
        return false;
      }
      
      // Success will be handled by onAuthStateChange listener
      toast.success('Login realizado com sucesso');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Sign up with email/password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      if (!data.user) {
        toast.error('Falha ao criar conta');
        return false;
      }
      
      // Insert the user profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        name: name,
        role: 'user',
        status: 'pending'
      });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
      
      toast.success('Conta criada com sucesso! Aguarde aprovação do administrador.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Erro ao criar conta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      
      // Clean up auth state
      cleanupAuthState();
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for a clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erro ao realizar logout');
    } finally {
      setLoading(false);
    }
  };

  // Password reset request function
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
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
      
      // First verify current password by trying to sign in with it
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentUser.email,
        password: currentPassword,
      });
      
      if (signInError) {
        toast.error('Senha atual incorreta');
        return false;
      }
      
      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
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

  const authValue = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    updatePassword,
    isAdmin,
  };
  
  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { User };
