
import { useAuth } from "@/contexts/AuthContext";
import UserList from "@/components/UserManagement/UserList";
import UserForm from "@/components/UserManagement/UserForm";
import UserManagementHeader from "@/components/UserManagement/components/UserManagementHeader";
import { useUserManagement } from "@/hooks/useUserManagement";

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const {
    showForm,
    selectedUser,
    handleAddClick,
    handleEditUser,
    handleFormCancel,
    handleFormSuccess,
  } = useUserManagement();

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
      <UserManagementHeader 
        showForm={showForm} 
        onAddClick={handleAddClick} 
      />

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
