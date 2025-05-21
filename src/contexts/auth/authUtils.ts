
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if current user has admin role
 */
export const isAdmin = (role?: string) => {
  return role === 'admin';
};

/**
 * Cleans up auth state - moved from supabase/client to here for better organization
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove cuidarUser from localStorage (from old auth system)
  localStorage.removeItem('cuidarUser');
};

/**
 * Determina se um usuário é o admin principal (marcio.sartini@gmail.com)
 */
export const isMainAdmin = (email?: string) => {
  return email === 'marcio.sartini@gmail.com';
};
