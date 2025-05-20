
import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: { id: string; title: string }[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      {steps.map((step, index) => (
        <div
          key={step.id}
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
      ))}
    </div>
  );
};

export default StepIndicator;
