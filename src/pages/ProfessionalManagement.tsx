import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from "@/components/ui/button";
import { Professional, professionalsStore } from "@/lib/professionalStore";
import ProfessionalList from "@/components/ProfessionalManagement/ProfessionalList";
import ProfessionalForm from "@/components/ProfessionalManagement/ProfessionalForm";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

const ProfessionalManagement = () => {
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | undefined>(undefined);
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  useEffect(() => {
    loadProfessionals();
  }, []);

  const loadProfessionals = () => {
    setProfessionals(professionalsStore.getProfessionals());
  };

  const handleAddClick = () => {
    setSelectedProfessional(undefined);
    setShowForm(true);
  };

  const handleEditProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProfessional(undefined);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedProfessional(undefined);
    loadProfessionals();
    toast.success(selectedProfessional ? "Profissional atualizado" : "Profissional cadastrado");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-custom-blue">Gerenciamento de Profissionais</h2>
          <p className="text-muted-foreground">Cadastre e gerencie os profissionais da casa de repouso</p>
        </div>
        {!showForm && (
          <Button 
            onClick={handleAddClick}
            className="bg-custom-blue hover:bg-custom-blue/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Profissional
          </Button>
        )}
      </div>

      {showForm ? (
        <ProfessionalForm 
          professional={selectedProfessional} 
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <ProfessionalList onEdit={handleEditProfessional} />
      )}
    </div>
  );
};

export default ProfessionalManagement;
