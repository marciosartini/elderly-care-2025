
import { useEvolutionList } from "./hooks/useEvolutionList";
import EvolutionFilters from "./EvolutionFilters";
import EvolutionTable from "./EvolutionTable";
import DeleteEvolutionDialog from "./DeleteEvolutionDialog";
import { EvolutionEntry } from "@/lib/evolutionStore";

interface EvolutionListProps {
  onView: (evolution: EvolutionEntry) => void;
}

const EvolutionList = ({ onView }: EvolutionListProps) => {
  const {
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
  } = useEvolutionList();

  return (
    <div className="space-y-4">
      <EvolutionFilters
        residents={residents}
        selectedResidentId={selectedResidentId}
        dateFilter={dateFilter}
        onResidentChange={setSelectedResidentId}
        onDateChange={setDateFilter}
        formatDateForDisplay={formatDateForDisplay}
        getResidentName={getResidentName}
      />

      <EvolutionTable
        evolutions={evolutions}
        formatDateForDisplay={formatDateForDisplay}
        getResidentName={getResidentName}
        onViewEvolution={onView}
        onDeleteEvolution={handleDeleteEvolution}
      />

      <DeleteEvolutionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default EvolutionList;
