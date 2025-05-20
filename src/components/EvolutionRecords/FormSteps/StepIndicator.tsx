
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: { id: string; title: string }[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {steps.map((step, index) => {
        // Generate a robust unique key for each step
        // Ensure we never use empty strings for keys or values
        const safeTitle = step.title && step.title.trim() !== "" ? step.title : `Passo ${index + 1}`;
        const safeId = step.id && step.id.trim() !== "" ? step.id : `step-${index}-${safeTitle.replace(/\s+/g, '-').toLowerCase()}`;
        
        return (
          <div
            key={safeId}
            className={`step-indicator ${
              index === currentStep
                ? "step-active"
                : index < currentStep
                ? "step-complete"
                : "step-incomplete"
            }`}
            title={safeTitle}
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
