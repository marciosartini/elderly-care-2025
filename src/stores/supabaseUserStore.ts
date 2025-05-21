
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
        createdAt: new Date(profile.created_at),
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
        createdAt: new Date(data.created_at),
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
      if (userData.password) {
        // Note: Password updates would require additional implementation
        // via admin functions or user-specific flows
      }
      
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Erro ao atualizar usuário");
      return false;
    }
  }
  
  /**
   * Dummy addUser method - would require Supabase Edge Functions in real implementation
   */
  async addUser(userData: Omit<User, "id" | "createdAt">): Promise<boolean> {
    // This is a placeholder - actual implementation would require Edge Functions
    // to create the auth user and then the profile
    toast.error("Criação de usuário pelo admin requer implementação de Edge Functions");
    return false;
  }
  
  /**
   * Dummy deleteUser method - would require Supabase Edge Functions in real implementation
   */
  async deleteUser(id: string): Promise<boolean> {
    // This is a placeholder - actual implementation would require Edge Functions
    toast.error("Exclusão de usuário pelo admin requer implementação de Edge Functions");
    return false;
  }
}

export const supabaseUserStore = new SupabaseUserStore();
