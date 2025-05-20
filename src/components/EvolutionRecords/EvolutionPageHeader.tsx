
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EvolutionPageHeaderProps {
  showAddButton: boolean;
  onAddClick: () => void;
}

const EvolutionPageHeader = ({ showAddButton, onAddClick }: EvolutionPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold text-custom-blue">Registro de Evoluções</h2>
        <p className="text-muted-foreground">Gerencie os registros de evolução dos residentes</p>
      </div>
      {showAddButton && (
        <Button 
          onClick={onAddClick}
          className="bg-custom-blue hover:bg-custom-blue/90"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Evolução
        </Button>
      )}
    </div>
  );
};

export default EvolutionPageHeader;
