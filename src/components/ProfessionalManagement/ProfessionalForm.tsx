
import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Professional, professionalsStore } from "@/lib/professionalStore";
import { Profession, professionsStore } from "@/lib/professionStore";
import { PlusCircle, Trash, Clock, Upload, Image } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfessionalFormProps {
  professional?: Professional;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProfessionalForm = ({ professional, onCancel, onSuccess }: ProfessionalFormProps) => {
  const editing = !!professional;
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(professional?.photo || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [schedules, setSchedules] = useState<Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    activities: string;
    id: string;
  }>>(
    professional?.schedule.map((schedule, index) => ({
      ...schedule,
      id: `schedule-${index}`,
    })) || []
  );

  useEffect(() => {
    // Load all professions
    setProfessions(professionsStore.getProfessions());
  }, []);

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }
    
    // Check file type (allow only images)
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setPhotoPreview(imageUrl);
      form.setValue("photo", imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

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

      <Card className="border-custom-gray/20">
        <CardHeader>
          <CardTitle className="text-xl text-custom-blue">
            Dados Pessoais e Profissionais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do profissional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foto do Profissional</FormLabel>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-16 h-16 border">
                            <AvatarImage src={photoPreview || "/placeholder.svg"} alt="Foto do profissional" />
                            <AvatarFallback>
                              <Image className="w-6 h-6 text-gray-400" />
                            </AvatarFallback>
                          </Avatar>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={triggerFileUpload}
                            className="flex gap-2 items-center"
                          >
                            <Upload className="h-4 w-4" />
                            Selecionar Imagem
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            ref={fileInputRef}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Formatos aceitos: JPG, PNG. Tamanho máximo: 5MB
                        </p>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="professionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma profissão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {professions.map((profession) => (
                            <SelectItem key={profession.id} value={profession.id}>
                              {profession.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Geriatria, Pediatria, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registro Profissional</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: CRM, COREN, CRN, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Experiência Profissional</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva experiências anteriores, empresas, tempo de atuação..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4 border-gray-200">
                <h3 className="text-lg font-medium mb-2">Informações de Contato</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
                    {schedules.map((schedule, index) => (
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
