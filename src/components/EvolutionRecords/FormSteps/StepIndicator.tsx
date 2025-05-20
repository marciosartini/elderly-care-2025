
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: { id: string; title: string }[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {steps.map((step, index) => {
        // Generate a consistent unique key for each step
        const stepKey = (step.id && step.id.trim() !== "") 
          ? step.id 
          : `step-${index}-${step.title.replace(/\s+/g, '-').toLowerCase() || 'unnamed'}`;
        
        return (
          <div
            key={stepKey}
            className={`step-indicator ${
              index === currentStep
                ? "step-active"
                : index < currentStep
                ? "step-complete"
                : "step-incomplete"
            }`}
            title={step.title || `Passo ${index + 1}`}
          >
            {index < currentStep ? (
              <Check size={16} />
            ) : (
              index + 1
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
