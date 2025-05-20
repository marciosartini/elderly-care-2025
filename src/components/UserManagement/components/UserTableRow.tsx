
import { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import UserActions from "./UserActions";
import { getAccessLevelColor, getAccessLevelLabel } from "../utils/userListUtils";

interface UserTableRowProps {
  user: User;
  onApprove: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserTableRow = ({ user, onApprove, onEdit, onDelete }: UserTableRowProps) => {
  return (
    <TableRow key={user.id}>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {user.role === 'admin' ? (
          <Badge className="bg-custom-blue">Administrador</Badge>
        ) : (
          <Badge className="bg-custom-green">Usuário</Badge>
        )}
      </TableCell>
      <TableCell>
        <Badge className={getAccessLevelColor(user.accessLevel)}>
          {getAccessLevelLabel(user.accessLevel)}
        </Badge>
      </TableCell>
      <TableCell>
        {user.status === 'pending' ? (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Pendente
          </Badge>
        ) : (
          <Badge className="bg-emerald-600">Ativo</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <UserActions 
          user={user}
          onApprove={onApprove}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
