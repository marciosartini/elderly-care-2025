import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EvolutionEntry } from "@/lib/evolution/types";
import { residentsStore } from "@/lib/residentStore";
import { ReactNode } from "react";
import { HeartPulse, Droplet, Activity, Brain, Users, Star, FileText } from "lucide-react";
import { ALL_CATEGORIES } from "./data/evolutionSteps";

interface EvolutionDetailsProps {
  evolution: EvolutionEntry;
  onBackClick: () => void;
}

const EvolutionDetails = ({ evolution, onBackClick }: EvolutionDetailsProps) => {
  // Utility functions for formatting and displaying data
  const getResidentName = (residentId: string) => {
    const resident = residentsStore.getResidentById(residentId);
    return resident?.name || "Residente não encontrado";
  };

  const getCategoryTitle = (categoryId: string) => {
    const category = ALL_CATEGORIES.find((cat) => cat.id === categoryId);
    return category?.title || categoryId;
  };

  // Format date for display (convert from YYYY-MM-DD to DD/MM/YYYY)
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "";
    
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Função para renderizar os ícones de categoria
  const getCategoryIcon = (categoryId: string): ReactNode => {
    switch (categoryId) {
      case "bloodPressure":
        return <HeartPulse className="text-red-500 animate-pulse" size={20} />;
      case "hydration":
        return <Droplet className="text-blue-500 animate-pulse" size={20} />;
      case "feeding":
      case "eating":
        return <Activity className="text-amber-500 animate-pulse" size={20} />;
      case "cognitiveOrientation":
      case "mood":
      case "emotionalState":
        return <Brain className="text-purple-500 animate-pulse" size={20} />;
      case "socialInteraction":
        return <Users className="text-green-500 animate-pulse" size={20} />;
      case "satisfactionLevel":
        return <Star className="text-custom-brown animate-pulse" size={20} />;
      case "notes":
        return <FileText className="text-blue-700 animate-pulse" size={20} />;
      default:
        return null;
    }
  };

  const renderEvolutionData = (categoryId: string, value: any): ReactNode => {
    const category = ALL_CATEGORIES.find((cat) => cat.id === categoryId);
    if (!category) return String(value);

    switch (category.fieldType) {
      case "boolean":
        return (
          <div className="flex items-center">
            {value ? 
              <span className="flex items-center text-green-600">
                <Star className="mr-1 animate-pulse" size={16} fill="#16a34a" /> Sim
              </span> : 
              <span className="flex items-center text-red-600">
                <Star className="mr-1" size={16} /> Não
              </span>
            }
          </div>
        );
      
      case "rating":
        return (
          <div className="flex">
            {Array(value)
              .fill(0)
              .map((_, i) => (
                <Star key={i} className="text-custom-brown animate-pulse" size={16} fill="#A78C5D" />
              ))}
          </div>
        );
      
      case "option":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((v, i) => (
                <span key={i} className="px-2 py-1 bg-gray-100 rounded-md text-xs">
                  {v}
                </span>
              ))}
            </div>
          );
        }
        return (
          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">
            {value}
          </span>
        );
      
      default:
        return String(value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBackClick}
        >
          Voltar para lista
        </Button>
      </div>
      
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Detalhes da Evolução</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <Label className="text-muted-foreground">Residente</Label>
              <p className="font-medium">{getResidentName(evolution.residentId)}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Data</Label>
              <p className="font-medium">
                {formatDateForDisplay(evolution.date)}
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground">Hora</Label>
              <p className="font-medium">{evolution.time}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground">Registrado por</Label>
            <p className="font-medium">{evolution.userName}</p>
          </div>
          
          <Separator />
          
          <div className="space-y-6">
            {Object.entries(evolution.data).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <Label className="text-muted-foreground flex items-center">
                  {getCategoryIcon(key)}
                  <span className="ml-2">{getCategoryTitle(key)}</span>
                </Label>
                <div className="animate-fade-in">{renderEvolutionData(key, value)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvolutionDetails;
