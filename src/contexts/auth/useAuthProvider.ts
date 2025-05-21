
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
    console.log("Initializing auth state");
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        console.log("Auth state changed:", event, session?.user?.email);
        
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
              // Handle this more gracefully now
              console.log('Tentando criar perfil para o usuário...');
              
              // Tenta criar o perfil se não existir
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email,
                  name: session.user.email?.split('@')[0] || 'Usuário',
                  role: session.user.email === 'msartini@gmail.com' ? 'admin' : 'user',
                  status: 'active' // Setting active by default now
                });
                
              if (insertError) {
                console.error('Profile creation error:', insertError);
                toast.error('Erro ao criar perfil do usuário');
                setCurrentUser(null);
              } else {
                // Successfully created profile, now fetch it
                const { data: newProfile, error: refetchError } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                  
                if (refetchError || !newProfile) {
                  console.error('Profile refetch error:', refetchError);
                  toast.error('Erro ao verificar perfil de usuário');
                  setCurrentUser(null);
                } else {
                  // Use the newly created profile
                  const user: User = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: newProfile.name || session.user.email?.split('@')[0] || '',
                    role: (newProfile.role as 'admin' | 'user') || 'user',
                    status: (newProfile.status as 'pending' | 'active') || 'active',
                    createdAt: newProfile.created_at ? new Date(newProfile.created_at) : new Date(),
                    accessLevel: 'basic'
                  };
                  
                  console.log("User signed in with profile:", user);
                  setCurrentUser(user);
                  toast.success('Login realizado com sucesso!');
                }
              }
            } else if (profile) {
              // Forçar status como active para msartini@gmail.com
              if (session.user.email === 'msartini@gmail.com' && profile.status !== 'active') {
                console.log("Atualizando status para ativo para o usuário administrador");
                await supabase
                  .from('profiles')
                  .update({ status: 'active', role: 'admin' })
                  .eq('id', session.user.id);
                  
                profile.status = 'active';
                profile.role = 'admin';
              }
              
              // Verificação de status foi desativada para permitir login
              const user: User = {
                id: session.user.id,
                email: session.user.email || '',
                name: profile.name || session.user.email?.split('@')[0] || '',
                role: (profile.role as 'admin' | 'user') || 'user',
                status: (profile.status as 'pending' | 'active') || 'active',
                createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
                accessLevel: 'basic'
              };
              
              console.log("User signed in with existing profile:", user);
              setCurrentUser(user);
              toast.success('Login realizado com sucesso!');
            } else {
              console.log("Perfil não encontrado mas sem erro. Isso não deveria acontecer.");
              setCurrentUser(null);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            toast.error('Erro ao carregar perfil do usuário');
            setCurrentUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setCurrentUser(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      console.log("Checking existing auth session");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Existing session found for:", session.user.email);
          // Fetch user profile from Supabase
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Profile fetch error during init:', error);
            
            // Tenta criar perfil se não existir
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email,
                name: session.user.email?.split('@')[0] || 'Usuário',
                role: session.user.email === 'msartini@gmail.com' ? 'admin' : 'user',
                status: 'active' // Setting active by default now
              });
              
            if (insertError) {
              console.error('Profile creation error during init:', insertError);
              toast.error('Erro ao criar perfil de usuário');
              setLoading(false);
            } else {
              // Busca o perfil recém criado
              const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (newProfile) {
                const user: User = {
                  id: session.user.id,
                  email: session.user.email || '',
                  name: newProfile.name || session.user.email?.split('@')[0] || '',
                  role: (newProfile.role as 'admin' | 'user') || 'user',
                  status: (newProfile.status as 'pending' | 'active') || 'active',
                  createdAt: newProfile.created_at ? new Date(newProfile.created_at) : new Date(),
                  accessLevel: 'basic'
                };
                
                console.log("User profile created during init:", user);
                setCurrentUser(user);
              }
            }
          } else if (profile) {
            // Forçar status como active para msartini@gmail.com
            if (session.user.email === 'msartini@gmail.com' && profile.status !== 'active') {
              console.log("Atualizando status para ativo para o usuário administrador");
              await supabase
                .from('profiles')
                .update({ status: 'active', role: 'admin' })
                .eq('id', session.user.id);
                
              profile.status = 'active';
              profile.role = 'admin';
            }
            
            // Desativação da verificação de status para permitir login
            const user: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name || session.user.email?.split('@')[0] || '',
              role: (profile.role as 'admin' | 'user') || 'user',
              status: (profile.status as 'pending' | 'active') || 'active',
              createdAt: profile.created_at ? new Date(profile.created_at) : new Date(),
              accessLevel: 'basic'
            };
            
            console.log("Setting user from existing profile during init:", user);
            setCurrentUser(user);
          }
        } else {
          console.log("No existing session found");
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
      console.log("Attempting login for:", email);
      setLoading(true);
      
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt to sign out globally first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Error during global signout:", err);
      }
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message);
        return false;
      }
      
      if (!data.user) {
        console.error("Login failed: No user data returned");
        toast.error('Falha ao realizar login');
        return false;
      }
      
      console.log("Login successful for:", email);
      
      // Forçar login para msartini@gmail.com sem verificar status
      if (email === 'msartini@gmail.com') {
        console.log("Login forçado para usuário administrador");
        toast.success('Login realizado com sucesso');
        return true;
      }
      
      // Check if the user's profile is active - desativado temporariamente
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', data.user.id)
        .single();
        
      if (profileError) {
        // Se não encontrar o perfil, criar um
        if (profileError.code === 'PGRST116') {
          console.log("Perfil não encontrado, criando...");
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email,
              name: email.split('@')[0] || 'Usuário',
              role: email === 'msartini@gmail.com' ? 'admin' : 'user',
              status: 'active' // Setting active by default now
            });
            
          if (insertError) {
            console.error("Error creating profile:", insertError);
            toast.error('Erro ao criar perfil de usuário');
            return false;
          }
        } else {
          console.error("Profile error:", profileError);
          toast.error('Erro ao verificar status do usuário');
          return false;
        }
      } else if (profile && profile.status !== 'active') {
        // Permitir login mesmo para contas pendentes
        console.log("Login permitido para conta com status:", profile.status);
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
