
import EvolutionList from "@/components/EvolutionRecords/EvolutionList";
import EvolutionForm from "@/components/EvolutionRecords/EvolutionForm";
import EvolutionDetails from "@/components/EvolutionRecords/EvolutionDetails";
import EvolutionPageHeader from "@/components/EvolutionRecords/EvolutionPageHeader";
import { useEvolutionRecordsPage } from "@/components/EvolutionRecords/hooks/useEvolutionRecordsPage";

const EvolutionRecords = () => {
  const {
    showForm,
    viewingEvolution,
    handleAddClick,
    handleViewEvolution,
    handleFormCancel,
    handleFormSuccess,
    handleBackToList,
  } = useEvolutionRecordsPage();

  return (
    <div className="space-y-6">
      <EvolutionPageHeader 
        showAddButton={!showForm && !viewingEvolution} 
        onAddClick={handleAddClick} 
      />

      {showForm ? (
        <EvolutionForm 
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      ) : viewingEvolution ? (
        <EvolutionDetails 
          evolution={viewingEvolution}
          onBackClick={handleBackToList}
        />
      ) : (
        <EvolutionList onView={handleViewEvolution} />
      )}
    </div>
  );
};

export default EvolutionRecords;
