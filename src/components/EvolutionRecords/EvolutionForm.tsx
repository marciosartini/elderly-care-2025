
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EVOLUTION_STEPS } from "./data/evolutionSteps";
import { useEvolutionForm } from "./hooks/useEvolutionForm";
import StepIndicator from "./FormSteps/StepIndicator";
import BasicInfoStep from "./FormSteps/BasicInfoStep";
import StepContent from "./FormSteps/StepContent";
import FormFooter from "./FormSteps/FormFooter";
import "./EvolutionForm.css";

interface EvolutionFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const EvolutionForm = ({ onCancel, onSuccess }: EvolutionFormProps) => {
  const {
    residents,
    selectedResidentId,
    setSelectedResidentId,
    date,
    setDate,
    time,
    setTime,
    formData,
    currentStep,
    basicInfoComplete,
    loading,
    systolic,
    setSystolic,
    diastolic,
    setDiastolic,
    handleInputChange,
    handleMultiOptionChange,
    handleNextStep,
    handlePrevStep,
    getCurrentStepCategories
  } = useEvolutionForm(onSuccess);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Registrar Evolução - {currentStep < EVOLUTION_STEPS.length
            ? EVOLUTION_STEPS[currentStep].title
            : "Revisão Final"
          }
        </CardTitle>
      </CardHeader>
      <form>
        <CardContent className="space-y-6">
          <StepIndicator steps={EVOLUTION_STEPS} currentStep={currentStep} />
          
          {currentStep === 0 && (
            <BasicInfoStep 
              residents={residents}
              selectedResidentId={selectedResidentId}
              setSelectedResidentId={setSelectedResidentId}
              date={date}
              setDate={setDate}
              time={time}
              setTime={setTime}
              systolic={systolic}
              setSystolic={setSystolic}
              diastolic={diastolic}
              setDiastolic={setDiastolic}
              loading={loading}
            />
          )}
          
          <StepContent 
            categories={getCurrentStepCategories()}
            formData={formData}
            handleInputChange={handleInputChange}
            handleMultiOptionChange={handleMultiOptionChange}
            loading={loading}
          />
          
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
            <div 
              className="bg-custom-blue h-2 rounded-full transition-all" 
              style={{ width: `${(currentStep / EVOLUTION_STEPS.length) * 100}%` }} 
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <FormFooter 
            currentStep={currentStep}
            totalSteps={EVOLUTION_STEPS.length}
            basicInfoComplete={basicInfoComplete}
            loading={loading}
            handlePrevStep={handlePrevStep}
            handleNextStep={handleNextStep}
            onCancel={onCancel}
          />
        </CardFooter>
      </form>
    </Card>
  );
};

export default EvolutionForm;
