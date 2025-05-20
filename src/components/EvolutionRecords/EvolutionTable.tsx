
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
import { Eye, Trash2 } from "lucide-react";
import { EvolutionEntry } from "@/lib/evolutionStore";

interface EvolutionTableProps {
  evolutions: EvolutionEntry[];
  formatDateForDisplay: (dateString: string) => string;
  getResidentName: (residentId: string) => string;
  onViewEvolution: (evolution: EvolutionEntry) => void;
  onDeleteEvolution: (evolutionId: string) => void;
}

const EvolutionTable = ({
  evolutions,
  formatDateForDisplay,
  getResidentName,
  onViewEvolution,
  onDeleteEvolution,
}: EvolutionTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableCaption>Lista de evoluções registradas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Hora</TableHead>
            <TableHead>Residente</TableHead>
            <TableHead>Registrado por</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evolutions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                Nenhuma evolução encontrada
              </TableCell>
            </TableRow>
          ) : (
            evolutions.map((evolution) => (
              <TableRow key={evolution.id} className="hover:bg-gray-50 transition-colors">
                <TableCell>
                  {formatDateForDisplay(evolution.date)}
                </TableCell>
                <TableCell>{evolution.time}</TableCell>
                <TableCell>{getResidentName(evolution.residentId)}</TableCell>
                <TableCell>{evolution.userName}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-custom-blue text-custom-blue hover:bg-custom-blue hover:text-white transition-colors"
                    onClick={() => onViewEvolution(evolution)}
                  >
                    <Eye className="mr-1 h-4 w-4" /> 
                    Visualizar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                    onClick={() => onDeleteEvolution(evolution.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EvolutionTable;
