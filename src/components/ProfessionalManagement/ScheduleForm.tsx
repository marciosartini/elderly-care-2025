
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash, Clock } from "lucide-react";

export interface ScheduleItem {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  activities: string;
  id: string;
}

interface ScheduleFormProps {
  schedules: ScheduleItem[];
  setSchedules: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
}

const ScheduleForm = ({ schedules, setSchedules }: ScheduleFormProps) => {
  const addSchedule = () => {
    setSchedules([
      ...schedules,
      {
        dayOfWeek: "",
        startTime: "",
        endTime: "",
        activities: "",
        id: `schedule-${Date.now()}`,
      },
    ]);
  };

  const updateSchedule = (id: string, field: string, value: string) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    );
  };

  const removeSchedule = (id: string) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
  };

  return (
    <div className="border-t pt-4 border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Rotina de Trabalho</h3>
        <Button
          type="button"
          variant="outline"
          onClick={addSchedule}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Adicionar Rotina
        </Button>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center p-4 border rounded-md bg-gray-50">
          <Clock className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-muted-foreground">
            Nenhuma rotina cadastrada. Clique no botão acima para adicionar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="grid gap-4 md:grid-cols-4 border p-4 rounded-md relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeSchedule(schedule.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dia da Semana</label>
                <Input
                  value={schedule.dayOfWeek}
                  onChange={(e) =>
                    updateSchedule(schedule.id, "dayOfWeek", e.target.value)
                  }
                  placeholder="Ex: Segunda-feira"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hora Início</label>
                <Input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) =>
                    updateSchedule(schedule.id, "startTime", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hora Fim</label>
                <Input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) =>
                    updateSchedule(schedule.id, "endTime", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-4">
                <label className="text-sm font-medium">Atividades</label>
                <Textarea
                  value={schedule.activities}
                  onChange={(e) =>
                    updateSchedule(schedule.id, "activities", e.target.value)
                  }
                  placeholder="Descreva as atividades realizadas neste horário"
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleForm;
