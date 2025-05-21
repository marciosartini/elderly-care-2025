
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabaseUserStore } from "@/stores/supabaseUserStore";
import { toast } from "sonner";

export const useUserManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users on mount and refresh
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const loadedUsers = await supabaseUserStore.getUsers();
    setUsers(loadedUsers);
  };

  const handleAddClick = () => {
    setSelectedUser(undefined);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedUser(undefined);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedUser(undefined);
    loadUsers(); // Refresh user list
    toast.success(selectedUser ? "Usuário atualizado com sucesso" : "Usuário criado com sucesso");
  };

  return {
    showForm,
    selectedUser,
    users,
    handleAddClick,
    handleEditUser,
    handleFormCancel,
    handleFormSuccess,
  };
};
