
import { useState, useEffect } from "react";
import { useAuth, User, usersStore } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import UserList from "@/components/UserManagement/UserList";
import UserForm from "@/components/UserManagement/UserForm";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load users on mount and refresh
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(usersStore.getUsers());
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

  // Only admins can access this page
  if (!isAdmin()) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-custom-blue mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-custom-blue">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
        </div>
        {!showForm && (
          <Button 
            onClick={handleAddClick}
            className="bg-custom-blue hover:bg-custom-blue/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Usuário
          </Button>
        )}
      </div>

      {showForm ? (
        <UserForm 
          user={selectedUser} 
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <UserList onEdit={handleEditUser} />
      )}
    </div>
  );
};

export default UserManagement;
