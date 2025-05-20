
import { useState, useEffect } from "react";
import { User, usersStore } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserListProps {
  onEdit: (user: User) => void;
}

// Helper function to get access level label
const getAccessLevelLabel = (level?: string) => {
  switch(level) {
    case "limited": return "Limitado";
    case "basic": return "Básico";
    case "full": return "Completo";
    default: return "Básico";
  }
};

// Helper function to get access level color
const getAccessLevelColor = (level?: string) => {
  switch(level) {
    case "limited": return "border-yellow-500 text-yellow-500";
    case "full": return "bg-purple-600";
    case "basic": 
    default: return "bg-blue-500";
  }
};

const UserList = ({ onEdit }: UserListProps) => {
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

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow">
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
                  <TableCell className="text-right space-x-2">
                    {user.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        onClick={() => handleApproveUser(user.id)}
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
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Excluir
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === 'delete' 
                ? "Excluir usuário" 
                : "Aprovar usuário"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === 'delete'
                ? "Esta ação não pode ser desfeita. Este usuário será permanentemente removido do sistema."
                : "Esta ação permitirá que o usuário acesse o sistema com as permissões designadas."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} className={pendingAction === 'delete' ? 'bg-red-600' : 'bg-green-600'}>
              {pendingAction === 'delete' ? "Sim, excluir" : "Sim, aprovar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserList;
