
import React from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Professional } from "@/lib/professionalStore";
import { Profession } from "@/lib/professionStore";
import { printProfessionalSchedule } from "@/lib/printUtils";

interface PrintScheduleButtonProps {
  professional: Professional;
  profession: Profession | null;
}

const PrintScheduleButton = ({ professional, profession }: PrintScheduleButtonProps) => {
  const handlePrint = () => {
    if (profession) {
      printProfessionalSchedule(professional, profession.name);
    } else {
      printProfessionalSchedule(professional, "Não especificada");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handlePrint}
      className="flex items-center gap-2"
    >
      <Printer className="h-4 w-4" />
      Imprimir Rotina
    </Button>
  );
};

export default PrintScheduleButton;
