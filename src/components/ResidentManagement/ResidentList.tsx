
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Resident, residentsStore } from "@/lib/residentStore";

interface ResidentListProps {
  onEdit: (resident: Resident) => void;
  onView: (resident: Resident) => void;
}

const ResidentList = ({ onEdit, onView }: ResidentListProps) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);

  // Load residents
  useEffect(() => {
    setResidents(residentsStore.getResidents());
  }, []);

  const handleDeleteResident = (id: string) => {
    setSelectedResidentId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedResidentId) return;

    residentsStore.deleteResident(selectedResidentId);
    setResidents(residentsStore.getResidents());
    toast.success("Residente removido com sucesso");
    setDialogOpen(false);
    setSelectedResidentId(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableCaption>Lista de residentes cadastrados</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Contatos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {residents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum residente cadastrado
                </TableCell>
              </TableRow>
            ) : (
              residents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell className="font-medium">{resident.name}</TableCell>
                  <TableCell>{resident.cpf}</TableCell>
                  <TableCell>{resident.phone}</TableCell>
                  <TableCell>{resident.contacts.length}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-custom-green text-custom-green"
                      onClick={() => onView(resident)}
                    >
                      Visualizar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-custom-blue text-custom-blue"
                      onClick={() => onEdit(resident)}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      onClick={() => handleDeleteResident(resident.id)}
                    >
                      Excluir
                    </Button>
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
            <AlertDialogTitle>Excluir residente</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Este residente será permanentemente removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResidentList;
