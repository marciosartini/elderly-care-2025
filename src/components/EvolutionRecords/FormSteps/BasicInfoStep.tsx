
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HeartPulse } from "lucide-react";
import { Resident } from "@/lib/residentStore";

interface BasicInfoStepProps {
  residents: Resident[];
  selectedResidentId: string;
  setSelectedResidentId: (id: string) => void;
  date: string;
  setDate: (date: string) => void;
  time: string;
  setTime: (time: string) => void;
  systolic: string;
  setSystolic: (value: string) => void;
  diastolic: string;
  setDiastolic: (value: string) => void;
  loading: boolean;
}

const BasicInfoStep = ({
  residents,
  selectedResidentId,
  setSelectedResidentId,
  date,
  setDate,
  time,
  setTime,
  systolic,
  setSystolic,
  diastolic,
  setDiastolic,
  loading
}: BasicInfoStepProps) => {
  // Enhanced function to ensure we always have a valid value for resident IDs
  const getResidentId = (resident: Resident, index: number): string => {
    // First check if the resident has a valid ID
    if (resident.id && resident.id.trim() !== "") {
      return resident.id;
    }
    
    // If the resident has a name, use it to create a unique ID
    if (resident.name && resident.name.trim() !== "") {
      return `resident_${index}_${resident.name.replace(/\s+/g, '_').toLowerCase()}`;
    }
    
    // Final fallback: use index only to ensure we never return an empty string
    return `resident_${index}_unnamed`;
  };

  const getPlaceholderId = (): string => {
    return "no_residents_available";
  };

  // Generate resident options, ensuring no empty values
  const getResidentOptions = () => {
    if (residents.length === 0) {
      return [
        <SelectItem 
          key="no-residents" 
          value={getPlaceholderId()}
        >
          Nenhum residente disponível
        </SelectItem>
      ];
    }

    return residents.map((resident, index) => {
      const residentId = getResidentId(resident, index);
      return (
        <SelectItem 
          key={`resident-${residentId}`} 
          value={residentId}
        >
          {resident.name && resident.name.trim() !== "" ? resident.name : `Residente ${index + 1}`}
        </SelectItem>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="resident">Residente *</Label>
          <Select
            value={selectedResidentId || getPlaceholderId()}
            onValueChange={setSelectedResidentId}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um residente" />
            </SelectTrigger>
            <SelectContent>
              {getResidentOptions()}
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
    </div>
  );
};

export default BasicInfoStep;
