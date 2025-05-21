
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cleanupAuthState } from './authUtils';

/**
 * Hook for providing authentication state and methods
 */
export const useAuthProvider = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
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
              
            if (error) {
              console.error('Profile fetch error:', error);
              // Instead of throwing, handle gracefully
              toast.error('Erro ao buscar perfil do usuário');
              await supabase.auth.signOut();
              setCurrentUser(null);
              setLoading(false);
              return;
            }
            
            // If profile not found, create one
            if (!profile) {
              console.log('Profile not found, creating...');
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.email?.split('@')[0] || '',
                  role: 'user',
                  status: 'pending'
                });
                
              if (insertError) {
                console.error('Profile creation error:', insertError);
                toast.error('Erro ao criar perfil de usuário');
                await supabase.auth.signOut();
                setCurrentUser(null);
                setLoading(false);
                return;
              }
              
              // Re-fetch the profile
              const { data: newProfile, error: refetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (refetchError || !newProfile) {
                console.error('Profile refetch error:', refetchError);
                toast.error('Erro ao verificar perfil de usuário');
                await supabase.auth.signOut();
                setCurrentUser(null);
                setLoading(false);
                return;
              }
              
              // Check if the auto-created profile is active
              if (newProfile.status !== 'active') {
                toast.error('Sua conta está pendente de aprovação pelo administrador');
                await supabase.auth.signOut();
                setCurrentUser(null);
                setLoading(false);
                return;
              }
              
              const user: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: newProfile.name || session.user.email?.split('@')[0] || '',
                role: (newProfile.role as 'admin' | 'user') || 'user',
                status: (newProfile.status as 'pending' | 'active') || 'pending',
                createdAt: newProfile.created_at ? new Date(newProfile.created_at) : new Date(),
                accessLevel: 'basic'
              };
              
              setCurrentUser(user);
            } else {
              // Check if the user account is active
              if (profile.status !== 'active') {
                toast.error('Sua conta está pendente de aprovação pelo administrador');
                await supabase.auth.signOut();
                setCurrentUser(null);
                setLoading(false);
                return;
              }
              
              const user: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || session.user.email?.split('@')[0] || '',
                role: (profile.role as 'admin' | 'user') || 'user',
                status: (profile.status as 'pending' | 'active') || 'pending',
                createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
                accessLevel: 'basic'
              };
              
              setCurrentUser(user);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Erro ao carregar perfil do usuário');
            await supabase.auth.signOut();
            setCurrentUser(null);
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
            
          if (error) {
            console.error('Profile fetch error during init:', error);
            // Handle more gracefully
            toast.error('Erro ao verificar status do usuário');
            await supabase.auth.signOut();
            setLoading(false);
            return;
          }
          
          // If profile not found, try to create one
          if (!profile) {
            console.log('Profile not found during init, creating...');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.email?.split('@')[0] || '',
                role: 'user',
                status: 'pending'
              });
              
            if (insertError) {
              console.error('Profile creation error during init:', insertError);
              toast.error('Erro ao criar perfil de usuário');
              await supabase.auth.signOut();
              setLoading(false);
              return;
            }
            
            // Re-fetch the profile
            const { data: newProfile, error: refetchError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (refetchError || !newProfile) {
              console.error('Profile refetch error during init:', refetchError);
              toast.error('Erro ao verificar perfil de usuário');
              await supabase.auth.signOut();
              setLoading(false);
              return;
            }
            
            // Check if the auto-created profile is active
            if (newProfile.status !== 'active') {
              toast.error('Sua conta está pendente de aprovação pelo administrador');
              await supabase.auth.signOut();
              setLoading(false);
              return;
            }
            
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: newProfile.name || session.user.email?.split('@')[0] || '',
              role: (newProfile.role as 'admin' | 'user') || 'user',
              status: (newProfile.status as 'pending' | 'active') || 'pending',
              createdAt: newProfile.created_at ? new Date(newProfile.created_at) : new Date(),
              accessLevel: 'basic'
            };
            
            setCurrentUser(user);
          } else {
            // Check if the user account is active
            if (profile.status !== 'active') {
              toast.error('Sua conta está pendente de aprovação pelo administrador');
              await supabase.auth.signOut();
              setCurrentUser(null);
              setLoading(false);
              return;
            }
            
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || session.user.email?.split('@')[0] || '',
              role: (profile.role as 'admin' | 'user') || 'user',
              status: (profile.status as 'pending' | 'active') || 'pending',
              createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
              accessLevel: 'basic'
            };
            
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        // If there's an error, sign out and clear session
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.error('Error signing out after session error:', e);
        }
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
      
      // Check if the user's profile is active
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', data.user.id)
        .single();
        
      if (profileError || !profile) {
        toast.error('Erro ao verificar status do usuário');
        return false;
      }
      
      if (profile.status !== 'active') {
        toast.error('Sua conta está pendente de aprovação pelo administrador');
        await supabase.auth.signOut();
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
  const isAdminUser = () => {
    return currentUser?.role === 'admin';
  };

  return {
    currentUser,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    updatePassword,
    isAdmin: isAdminUser,
  };
};
