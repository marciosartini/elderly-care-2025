
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { supabaseUserStore } from "@/stores/supabaseUserStore";
import { toast } from "sonner";

export const useUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'delete' | 'approve' | null>(null);

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await supabaseUserStore.getUsers();
      setUsers(loadedUsers);
    };
    
    loadUsers();
  }, []);

  const handleDeleteUser = (id: string) => {
    // Don't allow deleting the admin user
    const user = users.find(u => u.id === id);
    if (user && user.email === 'msartini@gmail.com') {
      toast.error("Não é possível excluir o administrador principal");
      return;
    }
    
    setSelectedUserId(id);
    setPendingAction('delete');
    setDialogOpen(true);
  };

  const handleApproveUser = (id: string) => {
    setSelectedUserId(id);
    setPendingAction('approve');
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!selectedUserId) return;

    if (pendingAction === 'delete') {
      const success = await supabaseUserStore.deleteUser(selectedUserId);
      if (success) {
        setUsers(users.filter(user => user.id !== selectedUserId));
        toast.success("Usuário removido com sucesso");
      }
    } else if (pendingAction === 'approve') {
      const success = await supabaseUserStore.updateUser(selectedUserId, { status: 'active' });
      if (success) {
        setUsers(users.map(user => 
          user.id === selectedUserId 
            ? { ...user, status: 'active' } 
            : user
        ));
        toast.success("Usuário aprovado com sucesso");
      }
    }

    setDialogOpen(false);
    setSelectedUserId(null);
    setPendingAction(null);
  };

  return {
    users,
    dialogOpen,
    pendingAction,
    setDialogOpen,
    handleDeleteUser,
    handleApproveUser,
    confirmAction
  };
};
