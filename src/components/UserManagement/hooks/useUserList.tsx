
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { usersStore } from "@/stores/userStore";
import { toast } from "sonner";

export const useUserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'delete' | 'approve' | null>(null);

  // Load users
  useEffect(() => {
    setUsers(usersStore.getUsers());
  }, []);

  const handleDeleteUser = (id: string) => {
    // Don't allow deleting the admin user
    const user = usersStore.getUserById(id);
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

  const confirmAction = () => {
    if (!selectedUserId) return;

    if (pendingAction === 'delete') {
      usersStore.deleteUser(selectedUserId);
      setUsers(usersStore.getUsers());
      toast.success("Usuário removido com sucesso");
    } else if (pendingAction === 'approve') {
      usersStore.updateUser(selectedUserId, { status: 'active' });
      setUsers(usersStore.getUsers());
      toast.success("Usuário aprovado com sucesso");
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
