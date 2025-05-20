
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
import { Check, X, AlertTriangle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { residentsStore, Resident } from "@/lib/residentStore";
import { EVOLUTION_CATEGORIES, evolutionsStore } from "@/lib/evolutionStore";

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

  useEffect(() => {
    // Load residents
    setResidents(residentsStore.getResidents());
  }, []);

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

  const validateForm = () => {
    if (!selectedResidentId) {
      toast.error("Selecione um residente");
      return false;
    }

    if (!date) {
      toast.error("Informe a data");
      return false;
    }

    if (!time) {
      toast.error("Informe a hora");
      return false;
    }

    if (!formData.bloodPressure) {
      toast.error("Informe a pressão arterial");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
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

  const renderField = (category: typeof EVOLUTION_CATEGORIES[0]) => {
    switch (category.fieldType) {
      case "text":
        return (
          <Textarea
            value={formData[category.id] || ""}
            onChange={(e) => handleInputChange(category.id, e.target.value)}
            disabled={loading}
            placeholder={`Informe ${category.title.toLowerCase()}`}
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
            placeholder={`Informe ${category.title.toLowerCase()}`}
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
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleInputChange(category.id, rating)}
                className={`p-2 ${
                  formData[category.id] === rating
                    ? "text-custom-brown"
                    : "text-gray-300"
                }`}
                disabled={loading}
              >
                <div className="flex">
                  {Array(rating)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        fill={
                          formData[category.id] === rating
                            ? "#A78C5D"
                            : "transparent"
                        }
                      />
                    ))}
                </div>
              </button>
            ))}
          </div>
        );

      case "option":
        return category.options ? (
          <div
            className={`grid grid-cols-${
              category.options.length <= 3 ? category.options.length : 3
            } gap-2`}
          >
            {category.options.map((option) => {
              const isSelected = category.allowMultiple
                ? (formData[category.id] || []).includes(option.value)
                : formData[category.id] === option.value;

              let Icon;
              switch (option.icon) {
                case "check":
                  Icon = Check;
                  break;
                case "x":
                  Icon = X;
                  break;
                case "alert-triangle":
                  Icon = AlertTriangle;
                  break;
                default:
                  Icon = null;
              }

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
                    isSelected ? "selected-option" : ""
                  }`}
                  disabled={loading}
                >
                  {Icon && <Icon size={24} />}
                  <span className="text-sm">{option.label}</span>
                </button>
              );
            })}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Evolução</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
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
          
          <Separator />

          <div className="space-y-8">
            {EVOLUTION_CATEGORIES.map((category) => (
              <div key={category.id} className="space-y-2">
                <Label>{category.title}</Label>
                {renderField(category)}
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-custom-blue hover:bg-custom-blue/90"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EvolutionForm;
