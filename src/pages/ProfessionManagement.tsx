
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Profession, professionsStore } from "@/lib/professionStore";
import ProfessionList from "@/components/ProfessionManagement/ProfessionList";
import ProfessionForm from "@/components/ProfessionManagement/ProfessionForm";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

const ProfessionManagement = () => {
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState<Profession | undefined>(undefined);
  const [professions, setProfessions] = useState<Profession[]>([]);

  useEffect(() => {
    loadProfessions();
  }, []);

  const loadProfessions = () => {
    setProfessions(professionsStore.getProfessions());
  };

  const handleAddClick = () => {
    setSelectedProfession(undefined);
    setShowForm(true);
  };

  const handleEditProfession = (profession: Profession) => {
    setSelectedProfession(profession);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedProfession(undefined);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedProfession(undefined);
    loadProfessions();
    toast.success(selectedProfession ? "Profissão atualizada" : "Profissão criada");
  };

  // Only admins can access this page
  if (!isAdmin()) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-custom-blue mb-2">Acesso Restrito</h2>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-custom-blue">Gerenciamento de Profissões</h2>
          <p className="text-muted-foreground">Cadastre e gerencie as profissões disponíveis no sistema</p>
        </div>
        {!showForm && (
          <Button 
            onClick={handleAddClick}
            className="bg-custom-blue hover:bg-custom-blue/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Profissão
          </Button>
        )}
      </div>

      {showForm ? (
        <ProfessionForm 
          profession={selectedProfession} 
          onCancel={handleFormCancel}
          onSuccess={handleFormSuccess}
        />
      ) : (
        <ProfessionList onEdit={handleEditProfession} />
      )}
    </div>
  );
};

export default ProfessionManagement;
