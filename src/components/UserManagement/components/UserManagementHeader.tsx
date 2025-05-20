
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface UserManagementHeaderProps {
  showForm: boolean;
  onAddClick: () => void;
}

const UserManagementHeader = ({ showForm, onAddClick }: UserManagementHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-custom-blue">Gerenciamento de Usuários</h2>
        <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
      </div>
      {!showForm && (
        <Button 
          onClick={onAddClick}
          className="bg-custom-blue hover:bg-custom-blue/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      )}
    </div>
  );
};

export default UserManagementHeader;
