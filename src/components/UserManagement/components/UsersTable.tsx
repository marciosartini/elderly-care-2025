
import { User } from "@/types/user";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import UserTableRow from "./UserTableRow";

interface UsersTableProps {
  users: User[];
  onApprove: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UsersTable = ({ users, onApprove, onEdit, onDelete }: UsersTableProps) => {
  return (
    <Table>
      <TableCaption>Lista de usuários do sistema</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Acesso</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
              Nenhum usuário cadastrado
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onApprove={onApprove}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
