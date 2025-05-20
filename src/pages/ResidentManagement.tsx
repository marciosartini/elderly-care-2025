
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ResidentList from "@/components/ResidentManagement/ResidentList";
import ResidentForm from "@/components/ResidentManagement/ResidentForm";
import ResidentDetail from "@/components/ResidentManagement/ResidentDetail";
import { useResidentManagement } from "@/components/ResidentManagement/hooks/useResidentManagement";

const ResidentManagement = () => {
  const {
    showResidentForm,
    selectedResident,
    viewMode,
    handleAddResidentClick,
    handleEditResident,
    handleViewResident,
    handleResidentFormCancel,
    handleResidentFormSuccess,
    handleBackToList
  } = useResidentManagement();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-custom-blue">Gerenciamento de Residentes</h2>
          <p className="text-muted-foreground">Gerencie os residentes e seus contatos</p>
        </div>
        {!showResidentForm && !viewMode && (
          <Button 
            onClick={handleAddResidentClick}
            className="bg-custom-blue hover:bg-custom-blue/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Residente
          </Button>
        )}
      </div>

      {showResidentForm ? (
        <ResidentForm 
          resident={selectedResident} 
          onCancel={handleResidentFormCancel}
          onSuccess={handleResidentFormSuccess}
        />
      ) : viewMode && selectedResident ? (
        <ResidentDetail
          resident={selectedResident}
          onEdit={handleEditResident}
          onBackToList={handleBackToList}
        />
      ) : (
        <ResidentList onEdit={handleEditResident} onView={handleViewResident} />
      )}
    </div>
  );
};

export default ResidentManagement;
