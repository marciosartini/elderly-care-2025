
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface FormFooterProps {
  currentStep: number;
  totalSteps: number;
  basicInfoComplete: boolean;
  loading: boolean;
  handlePrevStep: () => void;
  handleNextStep: () => void;
  onCancel: () => void;
}

const FormFooter = ({
  currentStep,
  totalSteps,
  basicInfoComplete,
  loading,
  handlePrevStep,
  handleNextStep,
  onCancel,
}: FormFooterProps) => {
  return (
    <div className="flex justify-between">
      <div>
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            disabled={loading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        )}
      </div>
      
      <div className="space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          onClick={handleNextStep}
          className="bg-custom-blue hover:bg-custom-blue/90"
          disabled={loading || (currentStep === 0 && !basicInfoComplete)}
        >
          {loading ? (
            "Processando..."
          ) : currentStep < totalSteps - 1 ? (
            <>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            "Finalizar"
          )}
        </Button>
      </div>
    </div>
  );
};

export default FormFooter;
