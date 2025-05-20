
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: { id: string; title: string }[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {steps.map((step, index) => {
        // Ensure step has a valid key by using index as fallback
        const stepKey = step.id && step.id.trim() !== "" ? step.id : `step-${index}`;
        
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
            title={step.title}
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
