import { useState, useEffect } from "react";
import { toast } from "sonner";
import { EvolutionEntry, evolutionsStore } from "@/lib/evolution";
import { residentsStore, Resident } from "@/lib/residentStore";

export const useEvolutionList = () => {
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

  useEffect(() => {
    filterEvolutions();
  }, [selectedResidentId, dateFilter]);

  const filterEvolutions = () => {
    let filteredEvolutions: EvolutionEntry[] = evolutionsStore.getEvolutions();
    
    if (selectedResidentId) {
      filteredEvolutions = filteredEvolutions.filter(
        (evolution) => evolution.residentId === selectedResidentId
      );
    }
    
    if (dateFilter) {
      // Fix the date comparison issue by normalizing both dates
      filteredEvolutions = filteredEvolutions.filter((evolution) => {
        // Convert evolution.date to YYYY-MM-DD format (should already be in this format)
        const evolutionDate = evolution.date;
        
        // The dateFilter is already in YYYY-MM-DD format from the input
        return evolutionDate === dateFilter;
      });
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

  // Format date for display (convert from YYYY-MM-DD to DD/MM/YYYY)
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return {
    evolutions,
    residents,
    selectedResidentId,
    dateFilter,
    dialogOpen,
    setSelectedResidentId,
    setDateFilter,
    setDialogOpen,
    handleDeleteEvolution,
    confirmDelete,
    getResidentName,
    formatDateForDisplay,
  };
};
