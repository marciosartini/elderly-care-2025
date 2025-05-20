
import { User } from "@/types/user";
import UsersTable from "./components/UsersTable";
import ConfirmationDialog from "./components/ConfirmationDialog";
import { useUserList } from "./hooks/useUserList";

interface UserListProps {
  onEdit: (user: User) => void;
}

const UserList = ({ onEdit }: UserListProps) => {
  const {
    users,
    dialogOpen,
    pendingAction,
    setDialogOpen,
    handleDeleteUser,
    handleApproveUser,
    confirmAction
  } = useUserList();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow">
        <UsersTable 
          users={users}
          onApprove={handleApproveUser}
          onEdit={onEdit}
          onDelete={handleDeleteUser}
        />
      </div>

      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={confirmAction}
        actionType={pendingAction}
      />
    </div>
  );
};

export default UserList;
