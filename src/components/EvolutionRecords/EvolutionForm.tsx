
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Check, X, AlertTriangle, ArrowRight, ArrowLeft, Star, Smile, Frown, Meh, Bed, User, HeartPulse, Droplet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { residentsStore, Resident } from "@/lib/residentStore";
import { EVOLUTION_CATEGORIES, evolutionsStore } from "@/lib/evolutionStore";
import "./EvolutionForm.css";

// Additional categories that might be relevant for nursing home evolution records
const ADDITIONAL_CATEGORIES = [
  {
    id: "vitalSigns",
    title: "Sinais Vitais",
    fieldType: "text",
    placeholder: "Temperatura, frequência cardíaca, etc."
  },
  {
    id: "medication",
    title: "Medicação",
    fieldType: "text",
    placeholder: "Liste os medicamentos administrados"
  },
  {
    id: "wounds",
    title: "Feridas/Lesões",
    fieldType: "boolean"
  },
  {
    id: "oxygenation",
    title: "Oxigenação",
    fieldType: "text",
    placeholder: "Saturação de O2, uso de suporte"
  },
  {
    id: "skinCondition",
    title: "Condição da Pele",
    fieldType: "option",
    options: [
      { id: "normal", value: "normal", label: "Normal", color: "bg-green-100", icon: "check" },
      { id: "dry", value: "dry", label: "Seca", color: "bg-yellow-100", icon: "alert-triangle" },
      { id: "redness", value: "redness", label: "Vermelhidão", color: "bg-red-100", icon: "x" }
    ]
  },
  {
    id: "respiratoryCondition",
    title: "Condição Respiratória",
    fieldType: "option",
    options: [
      { id: "normal", value: "normal", label: "Normal", color: "bg-green-100", icon: "check" },
      { id: "wheezing", value: "wheezing", label: "Chiado", color: "bg-yellow-100", icon: "alert-triangle" },
      { id: "shortness", value: "shortness", label: "Falta de ar", color: "bg-red-100", icon: "x" }
    ]
  }
];

// Combine original categories with additional ones
const ALL_CATEGORIES = [...EVOLUTION_CATEGORIES, ...ADDITIONAL_CATEGORIES];

// Group categories into logical steps
const EVOLUTION_STEPS = [
  {
    id: "basic",
    title: "Informações Básicas",
    categories: ["bloodPressure"]
  },
  {
    id: "nutrition",
    title: "Alimentação e Hidratação",
    categories: ["eating", "hydration"]
  },
  {
    id: "physical",
    title: "Condição Física",
    categories: ["physiologicalNeeds", "physicalActivity", "mobility", "skinCondition", "wounds"]
  },
  {
    id: "medical",
    title: "Condições Médicas",
    categories: ["pain", "medication", "oxygenation", "respiratoryCondition"]
  },
  {
    id: "mental",
    title: "Estado Mental e Emocional",
    categories: ["mood", "cognitiveOrientation", "sleep", "emotionalState"]
  },
  {
    id: "social",
    title: "Aspectos Sociais",
    categories: ["socialInteraction", "satisfactionLevel"]
  },
  {
    id: "notes",
    title: "Observações Adicionais",
    categories: ["notes"]
  }
];

interface EvolutionFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const EvolutionForm = ({ onCancel, onSuccess }: EvolutionFormProps) => {
  const navigate = useNavigate();
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

  const getIconForOption = (iconName: string) => {
    switch (iconName) {
      case "check": return <Check size={16} className="animate-pulse text-green-600" />;
      case "x": return <X size={16} className="animate-bounce text-red-600" />;
      case "alert-triangle": return <AlertTriangle size={16} className="animate-pulse text-amber-600" />;
      default: return null;
    }
  };

  const renderField = (category: any) => {
    // Campo especial para pressão arterial
    if (category.id === "bloodPressure") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="systolic">Pressão Arterial Sistólica (mmHg)</Label>
            <div className="flex items-center">
              <HeartPulse className="mr-2 h-5 w-5 text-red-500 animate-pulse" />
              <Input
                id="systolic"
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                disabled={loading}
                placeholder="Ex: 120"
                className="max-w-[120px]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="diastolic">Pressão Arterial Diastólica (mmHg)</Label>
            <div className="flex items-center">
              <HeartPulse className="mr-2 h-5 w-5 text-blue-500 animate-pulse" />
              <Input
                id="diastolic"
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                disabled={loading}
                placeholder="Ex: 80"
                className="max-w-[120px]"
              />
            </div>
          </div>
        </div>
      );
    }

    switch (category.fieldType) {
      case "text":
        return (
          <Textarea
            value={formData[category.id] || ""}
            onChange={(e) => handleInputChange(category.id, e.target.value)}
            disabled={loading}
            placeholder={category.placeholder || `Informe ${category.title.toLowerCase()}`}
            className="min-h-[80px]"
          />
        );

      case "number":
        return (
          <Input
            type="text"
            value={formData[category.id] || ""}
            onChange={(e) => handleInputChange(category.id, e.target.value)}
            disabled={loading}
            placeholder={category.placeholder || `Informe ${category.title.toLowerCase()}`}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={!!formData[category.id]}
              onCheckedChange={(checked) =>
                handleInputChange(category.id, checked)
              }
              disabled={loading}
            />
            <Label>{formData[category.id] ? "Sim" : "Não"}</Label>
          </div>
        );

      case "rating":
        return (
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange(category.id, rating)}
                className={`p-1 ${
                  formData[category.id] === rating
                    ? "text-custom-brown"
                    : "text-gray-300"
                } transition-transform hover:scale-110`}
                disabled={loading}
              >
                <div className="flex">
                  {Array(rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={
                          formData[category.id] === rating
                            ? "#A78C5D"
                            : "transparent"
                        }
                        className={formData[category.id] === rating ? "animate-pulse" : ""}
                      />
                    ))}
                </div>
              </button>
            ))}
          </div>
        );

      case "option":
        return category.options ? (
          <div className="flex flex-wrap gap-2">
            {category.options.map((option: any) => {
              const isSelected = category.allowMultiple
                ? (formData[category.id] || []).includes(option.value)
                : formData[category.id] === option.value;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    category.allowMultiple
                      ? handleMultiOptionChange(category.id, option.value)
                      : handleInputChange(category.id, option.value)
                  }
                  className={`evolution-option ${option.color || "bg-gray-100"} ${
                    isSelected ? "selected-option border-2 border-custom-blue" : ""
                  } p-2 rounded-md flex items-center gap-2 text-sm transition-all hover:scale-105`}
                  disabled={loading}
                >
                  {isSelected ? (
                    getIconForOption(option.icon)
                  ) : (
                    <div className="w-4 h-4"></div>
                  )}
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        ) : null;

      default:
        return null;
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

  // Initial step with resident selection and date/time
  const renderBasicInfoStep = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="resident">Residente *</Label>
            <Select
              value={selectedResidentId}
              onValueChange={setSelectedResidentId}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um residente" />
              </SelectTrigger>
              <SelectContent>
                {residents.map((resident) => (
                  <SelectItem key={resident.id} value={resident.id}>
                    {resident.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Hora *</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    );
  };

  // Renderiza os indicadores de etapa
  const renderStepIndicators = () => {
    return (
      <div className="flex justify-center space-x-2 mb-4">
        {EVOLUTION_STEPS.map((step, index) => (
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
          {renderStepIndicators()}
          
          {currentStep === 0 && renderBasicInfoStep()}
          
          <div className="space-y-8">
            {getCurrentStepCategories().map((category: any) => (
              <div key={category.id} className="space-y-2">
                <Label>{category.title}</Label>
                {renderField(category)}
              </div>
            ))}
          </div>
          
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
            <div 
              className="bg-custom-blue h-2 rounded-full transition-all" 
              style={{ width: `${(currentStep / EVOLUTION_STEPS.length) * 100}%` }} 
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
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
              ) : currentStep < EVOLUTION_STEPS.length - 1 ? (
                <>
                  Próximo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                "Finalizar"
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EvolutionForm;
