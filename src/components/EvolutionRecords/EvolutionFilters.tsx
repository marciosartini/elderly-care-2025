import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Filter, Printer } from "lucide-react";
import { toast } from "sonner";
import { Resident } from "@/lib/residentStore";
import { printEvolutionReport } from "@/lib/printUtils";
import { evolutionsStore } from "@/lib/evolution";

interface EvolutionFiltersProps {
  residents: Resident[];
  selectedResidentId: string;
  dateFilter: string;
  onResidentChange: (residentId: string) => void;
  onDateChange: (date: string) => void;
  formatDateForDisplay: (dateString: string) => string;
  getResidentName: (residentId: string) => string;
}

const EvolutionFilters = ({
  residents,
  selectedResidentId,
  dateFilter,
  onResidentChange,
  onDateChange,
  formatDateForDisplay,
  getResidentName,
}: EvolutionFiltersProps) => {
  // Value for the "all residents" option
  const allResidentsValue = "all_residents";

  const handleExportPDF = () => {
    // Get filtered evolutions based on current filters
    let evolutions = evolutionsStore.getEvolutions();
    
    if (selectedResidentId && selectedResidentId !== allResidentsValue) {
      evolutions = evolutions.filter(
        evolution => evolution.residentId === selectedResidentId
      );
    }
    
    if (dateFilter) {
      evolutions = evolutions.filter(
        evolution => evolution.date === dateFilter
      );
    }
    
    // Sort by date (newest first) and time
    evolutions.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return b.time.localeCompare(a.time);
    });

    toast.info("Preparando relatório para impressão...");
    
    // Use the printEvolutionReport function to generate and print the report
    printEvolutionReport(
      evolutions, 
      residents, 
      selectedResidentId !== allResidentsValue ? selectedResidentId : null,
      dateFilter || null
    );
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
          <div className="space-y-2 flex-1">
            <Label htmlFor="residentFilter">Filtrar por Residente</Label>
            <Select
              value={selectedResidentId || allResidentsValue}
              onValueChange={onResidentChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os residentes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={allResidentsValue}>Todos os residentes</SelectItem>
                {residents.map((resident) => (
                  <SelectItem key={resident.id} value={resident.id || `resident-${resident.name || "unnamed"}`}>
                    {resident.name || "Residente sem nome"}
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
                onChange={(e) => onDateChange(e.target.value)}
              />
              {dateFilter && (
                <Button
                  variant="outline"
                  className="border-custom-blue text-custom-blue"
                  onClick={() => onDateChange("")}
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
            <Printer className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Filter className="h-4 w-4" />
          {selectedResidentId || dateFilter ? (
            <span>
              Filtros ativos: 
              {selectedResidentId && selectedResidentId !== allResidentsValue && ` Residente: ${getResidentName(selectedResidentId)}`}
              {dateFilter && ` Data: ${formatDateForDisplay(dateFilter)}`}
            </span>
          ) : (
            <span>Sem filtros ativos</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvolutionFilters;
