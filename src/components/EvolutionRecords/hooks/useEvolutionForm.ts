import { useState, useEffect } from "react";
import { toast } from "sonner";
import { residentsStore, Resident } from "@/lib/residentStore";
import { evolutionsStore } from "@/lib/evolution";
import { useAuth } from '@/contexts/auth/AuthContext';
import { ALL_CATEGORIES, EVOLUTION_STEPS } from "../data/evolutionSteps";

export const useEvolutionForm = (onSuccess: () => void) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResidentId, setSelectedResidentId] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState<string>(
    new Date().toTimeString().split(":").slice(0, 2).join(":")
  );
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [basicInfoComplete, setBasicInfoComplete] = useState(false);
  
  // Campos específicos para pressão arterial
  const [systolic, setSystolic] = useState<string>("");
  const [diastolic, setDiastolic] = useState<string>("");

  useEffect(() => {
    // Load residents
    setResidents(residentsStore.getResidents());
  }, []);

  // Check if basic information is complete
  useEffect(() => {
    setBasicInfoComplete(!!selectedResidentId && !!date && !!time);
  }, [selectedResidentId, date, time]);

  // Atualiza o formData com os valores da pressão arterial combinados
  useEffect(() => {
    if (systolic && diastolic) {
      setFormData(prev => ({
        ...prev,
        bloodPressure: `${systolic}/${diastolic} mmHg`
      }));
    }
  }, [systolic, diastolic]);

  const handleInputChange = (categoryId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [categoryId]: value,
    }));
  };

  const handleMultiOptionChange = (categoryId: string, optionValue: string) => {
    setFormData((prev) => {
      const currentValues = prev[categoryId] || [];
      
      if (currentValues.includes(optionValue)) {
        return {
          ...prev,
          [categoryId]: currentValues.filter(
            (value: string) => value !== optionValue
          ),
        };
      } else {
        return {
          ...prev,
          [categoryId]: [...currentValues, optionValue],
        };
      }
    });
  };

  const validateCurrentStep = () => {
    // First step validation (basic info)
    if (currentStep === 0 && !basicInfoComplete) {
      toast.error("Preencha todas as informações básicas");
      return false;
    }

    // For blood pressure validation
    if (currentStep === 0) {
      if (!systolic || !diastolic) {
        toast.error("Informe a pressão arterial completa (sistólica e diastólica)");
        return false;
      }
      
      const systolicNum = parseInt(systolic);
      const diastolicNum = parseInt(diastolic);
      
      if (isNaN(systolicNum) || isNaN(diastolicNum) || 
          systolicNum < 70 || systolicNum > 250 || 
          diastolicNum < 40 || diastolicNum > 150) {
        toast.error("Valores de pressão arterial inválidos");
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < EVOLUTION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;
    if (!currentUser) return;

    setLoading(true);

    try {
      evolutionsStore.addEvolution({
        residentId: selectedResidentId,
        date,
        time,
        userId: currentUser.id,
        userName: currentUser.name,
        data: formData,
      });

      toast.success("Evolução registrada com sucesso");
      onSuccess();
    } catch (error) {
      console.error("Error saving evolution:", error);
      toast.error("Erro ao registrar evolução");
    } finally {
      setLoading(false);
    }
  };

  // Get all categories for the current step
  const getCurrentStepCategories = () => {
    if (currentStep >= EVOLUTION_STEPS.length) return [];
    
    const step = EVOLUTION_STEPS[currentStep];
    return step.categories.map(categoryId => 
      ALL_CATEGORIES.find(cat => cat.id === categoryId)
    ).filter(Boolean);
  };

  return {
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
  };
};
