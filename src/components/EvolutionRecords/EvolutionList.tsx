
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { FileText, Download, Trash2, Eye, Filter } from "lucide-react";
import { residentsStore, Resident } from "@/lib/residentStore";
import { EvolutionEntry, evolutionsStore } from "@/lib/evolutionStore";

interface EvolutionListProps {
  onView: (evolution: EvolutionEntry) => void;
}

const EvolutionList = ({ onView }: EvolutionListProps) => {
  const [evolutions, setEvolutions] = useState<EvolutionEntry[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvolutionId, setSelectedEvolutionId] = useState<string | null>(null);

  useEffect(() => {
    // Load residents
    setResidents(residentsStore.getResidents());
    
    // Load evolutions
    filterEvolutions();
  }, []);

  const filterEvolutions = () => {
    let filteredEvolutions: EvolutionEntry[] = evolutionsStore.getEvolutions();
    
    if (selectedResidentId) {
      filteredEvolutions = filteredEvolutions.filter(
        (evolution) => evolution.residentId === selectedResidentId
      );
    }
    
    if (dateFilter) {
      filteredEvolutions = filteredEvolutions.filter(
        (evolution) => evolution.date === dateFilter
      );
    }
    
    // Sort by date (newest first) and then by time
    filteredEvolutions.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return b.time.localeCompare(a.time);
    });
    
    setEvolutions(filteredEvolutions);
  };

  useEffect(() => {
    filterEvolutions();
  }, [selectedResidentId, dateFilter]);

  const handleDeleteEvolution = (id: string) => {
    setSelectedEvolutionId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedEvolutionId) return;

    evolutionsStore.deleteEvolution(selectedEvolutionId);
    filterEvolutions();
    toast.success("Evolução removida com sucesso");
    setDialogOpen(false);
    setSelectedEvolutionId(null);
  };

  const getResidentName = (residentId: string) => {
    const resident = residents.find((r) => r.id === residentId);
    return resident?.name || "Residente não encontrado";
  };

  const handleExportPDF = () => {
    // Em um app real, implementaria a exportação para PDF
    toast.info("Exportação de relatório em PDF iniciada...");
    setTimeout(() => {
      toast.success("Relatório em PDF gerado com sucesso!");
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="residentFilter">Filtrar por Residente</Label>
              <Select
                value={selectedResidentId}
                onValueChange={setSelectedResidentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os residentes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os residentes</SelectItem>
                  {residents.map((resident) => (
                    <SelectItem key={resident.id} value={resident.id}>
                      {resident.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label htmlFor="dateFilter">Filtrar por Data</Label>
              <div className="flex space-x-2">
                <Input
                  id="dateFilter"
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
                {dateFilter && (
                  <Button
                    variant="outline"
                    className="border-custom-blue text-custom-blue"
                    onClick={() => setDateFilter("")}
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </div>

            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleExportPDF}
            >
              <FileText className="h-4 w-4" />
              <Download className="h-4 w-4" />
              Exportar Relatório
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Filter className="h-4 w-4" />
            {selectedResidentId || dateFilter ? (
              <span>
                Filtros ativos: 
                {selectedResidentId && ` Residente: ${getResidentName(selectedResidentId)}`}
                {dateFilter && ` Data: ${new Date(dateFilter).toLocaleDateString("pt-BR")}`}
              </span>
            ) : (
              <span>Sem filtros ativos</span>
            )}
          </div>
        </CardContent>
      </Card>

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
                    {new Date(evolution.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{evolution.time}</TableCell>
                  <TableCell>{getResidentName(evolution.residentId)}</TableCell>
                  <TableCell>{evolution.userName}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-custom-blue text-custom-blue hover:bg-custom-blue hover:text-white transition-colors"
                      onClick={() => onView(evolution)}
                    >
                      <Eye className="mr-1 h-4 w-4" /> 
                      Visualizar
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      onClick={() => handleDeleteEvolution(evolution.id)}
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

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir evolução</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Este registro de evolução será permanentemente removido do sistema.
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

export default EvolutionList;
