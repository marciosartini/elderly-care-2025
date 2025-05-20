
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";

interface UserActionsProps {
  user: User;
  onApprove: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserActions = ({ user, onApprove, onEdit, onDelete }: UserActionsProps) => {
  return (
    <div className="text-right space-x-2">
      {user.status === 'pending' && (
        <Button 
          size="sm" 
          variant="outline" 
          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          onClick={() => onApprove(user.id)}
        >
          Aprovar
        </Button>
      )}
      <Button 
        size="sm" 
        variant="outline" 
        className="border-custom-blue text-custom-blue"
        onClick={() => onEdit(user)}
      >
        Editar
      </Button>
      {/* Don't show delete button for admin user */}
      {user.email !== 'msartini@gmail.com' && (
        <Button 
          size="sm" 
          variant="outline" 
          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          onClick={() => onDelete(user.id)}
        >
          Excluir
        </Button>
      )}
    </div>
  );
};

export default UserActions;
