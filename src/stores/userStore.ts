import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { toast } from "sonner";

/**
 * Store for managing users with Supabase
 */
class SupabaseUserStore {
  /**
   * Get all users from profiles table
   */
  async getUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      
      if (error) {
        throw error;
      }
      
      return data.map(profile => ({
        id: profile.id,
        email: profile.email || '',
        name: profile.name || '',
        role: profile.role as 'admin' | 'user',
        status: profile.status as 'pending' | 'active',
        createdAt: new Date(profile.created_at || new Date()),
        accessLevel: 'basic' // Default access level
      }));
    } catch (error) {
      console.error("Error getting users:", error);
      toast.error("Erro ao carregar usuários");
      return [];
    }
  }
  
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        return null;
      }
      
      return {
        id: data.id,
        email: data.email || '',
        name: data.name || '',
        role: data.role as 'admin' | 'user',
        status: data.status as 'pending' | 'active',
        createdAt: new Date(data.created_at || new Date()),
        accessLevel: 'basic' // Default access level
      };
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }
  
  /**
   * Update user profile
   */
  async updateUser(id: string, userData: Partial<User>): Promise<boolean> {
    try {
      // Only update fields that exist in the profiles table
      const updateData: any = {};
      
      if (userData.name) updateData.name = userData.name;
      if (userData.role) updateData.role = userData.role;
      if (userData.status) updateData.status = userData.status;
      
      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", id);
      
      if (error) {
        throw error;
      }
      
      // Password updates are handled by Auth API
      if ('password' in userData && userData.password) {
        // In a real implementation, this would require an Edge Function
        console.log("Password update requested but not implemented");
        toast.warning("Atualização de senha requer implementação adicional");
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erro ao atualizar usuário");
      return false;
    }
  }
  
  /**
   * Add a new user - requires Edge Function implementation
   */
  async addUser(userData: Omit<User, "id" | "createdAt">): Promise<boolean> {
    try {
      // In a real implementation, this would require an Edge Function to:
      // 1. Create auth user
      // 2. Create profile entry
      
      toast.warning("Para implementar a criação de usuário pelo admin, é necessário uma Edge Function");
      console.log("User creation requested with data:", userData);
      
      return false;
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Erro ao criar usuário");
      return false;
    }
  }
  
  /**
   * Delete a user - requires Edge Function implementation
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      // In a real implementation, this would require an Edge Function to:
      // 1. Delete auth user
      // 2. Delete profile entry (could be automatic with cascade)
      
      toast.warning("Para implementar a exclusão de usuário pelo admin, é necessário uma Edge Function");
      console.log("User deletion requested for ID:", id);
      
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erro ao excluir usuário");
      return false;
    }
  }
}

export const supabaseUserStore = new SupabaseUserStore();
