
import { useState } from "react";
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
import { Edit, Trash } from "lucide-react";
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

interface ProfessionListProps {
  onEdit: (profession: Profession) => void;
}

const ProfessionList = ({ onEdit }: ProfessionListProps) => {
  const [professions, setProfessions] = useState<Profession[]>(
    professionsStore.getProfessions()
  );
  const [professionToDelete, setProfessionToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setProfessionToDelete(id);
  };

  const confirmDelete = () => {
    if (professionToDelete) {
      professionsStore.deleteProfession(professionToDelete);
      setProfessions(professionsStore.getProfessions());
      toast.success("Profissão removida com sucesso!");
      setProfessionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setProfessionToDelete(null);
  };

  return (
    <Card className="border-custom-gray/20">
      <div className="p-6">
        {professions.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-muted-foreground">Nenhuma profissão cadastrada.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professions.map((profession) => (
                <TableRow key={profession.id}>
                  <TableCell className="font-medium">{profession.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {profession.description.length > 100
                      ? `${profession.description.substring(0, 100)}...`
                      : profession.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(profession)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog open={professionToDelete === profession.id} onOpenChange={() => setProfessionToDelete(null)}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(profession.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a profissão "{profession.name}"?
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

export default ProfessionList;
