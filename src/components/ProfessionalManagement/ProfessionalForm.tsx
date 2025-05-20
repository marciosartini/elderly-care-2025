
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Professional, professionalsStore } from "@/lib/professionalStore";
import { Profession, professionsStore } from "@/lib/professionStore";
import ProfessionalInfoForm from "./ProfessionalInfoForm";
import ScheduleForm from "./ScheduleForm";
import { ScheduleItem } from "./ScheduleForm";
import PrintScheduleButton from "./PrintScheduleButton";

interface ProfessionalFormProps {
  professional?: Professional;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProfessionalForm = ({ professional, onCancel, onSuccess }: ProfessionalFormProps) => {
  const editing = !!professional;
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(professional?.photo || null);
  const [currentProfession, setCurrentProfession] = useState<Profession | null>(null);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(
    professional?.schedule.map((schedule, index) => ({
      ...schedule,
      id: `schedule-${index}`,
    })) || []
  );

  useEffect(() => {
    // Load all professions
    const allProfessions = professionsStore.getProfessions();
    setProfessions(allProfessions);
    
    // If editing, find the current profession
    if (professional?.professionId) {
      const professionData = allProfessions.find(p => p.id === professional.professionId) || null;
      setCurrentProfession(professionData);
    }
  }, [professional]);

  // Form schema
  const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    photo: z.string().optional(),
    professionId: z.string().min(1, "Profissão é obrigatória"),
    experience: z.string().min(1, "Experiência é obrigatória"),
    phone: z.string().min(1, "Telefone é obrigatório"),
    email: z.string().email("E-mail inválido"),
    registration: z.string().min(1, "Registro é obrigatório"),
    specialty: z.string().min(1, "Especialidade é obrigatória"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: professional?.name || "",
      photo: professional?.photo || "/placeholder.svg",
      professionId: professional?.professionId || "",
      experience: professional?.experience || "",
      phone: professional?.contact?.phone || "",
      email: professional?.contact?.email || "",
      registration: professional?.registration || "",
      specialty: professional?.specialty || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      // Validate schedules
      const validSchedules = schedules.filter(
        (s) => s.dayOfWeek && s.startTime && s.endTime
      );

      if (validSchedules.length !== schedules.length) {
        toast.error("Preencha todos os campos das rotinas diárias");
        return;
      }

      // Prepare professional data
      const professionalData = {
        name: values.name,
        photo: photoPreview || "/placeholder.svg",
        professionId: values.professionId,
        experience: values.experience,
        contact: {
          phone: values.phone,
          email: values.email,
        },
        registration: values.registration,
        specialty: values.specialty,
        schedule: schedules.map(({ id, ...schedule }) => schedule), // Remove the temporary id
      };

      if (editing && professional) {
        professionalsStore.updateProfessional(professional.id, professionalData);
        toast.success("Profissional atualizado com sucesso!");
      } else {
        professionalsStore.addProfessional(professionalData);
        toast.success("Profissional cadastrado com sucesso!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Erro ao salvar profissional");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-custom-blue">
            {editing ? "Editar Profissional" : "Novo Profissional"}
          </h2>
          <p className="text-muted-foreground">
            {editing
              ? "Atualize os dados do profissional"
              : "Preencha os dados para cadastrar um novo profissional"}
          </p>
        </div>
        
        {editing && professional && (
          <PrintScheduleButton 
            professional={professional}
            profession={currentProfession}
          />
        )}
      </div>

      <Card className="border-custom-gray/20">
        <CardHeader>
          <CardTitle className="text-xl text-custom-blue">
            Dados Pessoais e Profissionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ProfessionalInfoForm
                form={form}
                professions={professions}
                photoPreview={photoPreview}
                setPhotoPreview={setPhotoPreview}
              />
              
              <ScheduleForm 
                schedules={schedules}
                setSchedules={setSchedules}
              />

              <CardFooter className="flex justify-between border-t pt-5 px-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-custom-blue hover:bg-custom-blue/90"
                >
                  {editing ? "Atualizar" : "Cadastrar"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalForm;
