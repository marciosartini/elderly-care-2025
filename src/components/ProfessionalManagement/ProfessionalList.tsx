
import { useState, useEffect } from "react";
import { Professional, professionalsStore } from "@/lib/professionalStore";
import { Profession, professionsStore } from "@/lib/professionStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Edit, Trash, User } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfessionalListProps {
  onEdit: (professional: Professional) => void;
}

const ProfessionalList = ({ onEdit }: ProfessionalListProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [professionsMap, setProfessionsMap] = useState<Map<string, Profession>>(new Map());
  const [professionalToDelete, setProfessionalToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProfessionals();
    
    // Create a map of professions for easier lookup
    const professions = professionsStore.getProfessions();
    const map = new Map();
    professions.forEach(profession => {
      map.set(profession.id, profession);
    });
    setProfessionsMap(map);
  }, []);

  const loadProfessionals = () => {
    const data = professionalsStore.getProfessionals();
    setProfessionals(data);
  };

  const handleDelete = (id: string) => {
    setProfessionalToDelete(id);
  };

  const confirmDelete = () => {
    if (professionalToDelete) {
      professionalsStore.deleteProfessional(professionalToDelete);
      loadProfessionals();
      toast.success("Profissional removido com sucesso!");
      setProfessionalToDelete(null);
    }
  };

  const cancelDelete = () => {
    setProfessionalToDelete(null);
  };

  return (
    <Card className="border-custom-gray/20">
      <div className="p-6">
        {professionals.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">Nenhum profissional cadastrado.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Profissão</TableHead>
                <TableHead className="hidden md:table-cell">Especialidade</TableHead>
                <TableHead className="hidden md:table-cell">Contato</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionals.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {professional.photo ? (
                        <img 
                          src={professional.photo} 
                          alt={professional.name}
                          className="w-8 h-8 rounded-full object-cover" 
                        />
                      ) : (
                        <User className="w-8 h-8 p-1 bg-gray-100 rounded-full" />
                      )}
                      {professional.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    {professionsMap.get(professional.professionId)?.name || "Não especificada"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {professional.specialty || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {professional.contact.email}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(professional)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog open={professionalToDelete === professional.id} onOpenChange={() => setProfessionalToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(professional.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o profissional "{professional.name}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={cancelDelete}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
};

export default ProfessionalList;
