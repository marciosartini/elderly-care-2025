
import React from "react";
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Profession, professionsStore } from "@/lib/professionStore";

interface ProfessionFormProps {
  profession?: Profession;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProfessionForm = ({ profession, onCancel, onSuccess }: ProfessionFormProps) => {
  const editing = !!profession;

  // Form schema
  const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profession?.name || "",
      description: profession?.description || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    try {
      if (editing && profession) {
        professionsStore.updateProfession(profession.id, values);
        toast.success("Profissão atualizada com sucesso!");
      } else {
        professionsStore.addProfession(values);
        toast.success("Profissão cadastrada com sucesso!");
      }
      onSuccess();
    } catch (error) {
      toast.error("Erro ao salvar profissão");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-custom-blue">
          {editing ? "Editar Profissão" : "Nova Profissão"}
        </h2>
        <p className="text-muted-foreground">
          {editing
            ? "Atualize os dados da profissão"
            : "Preencha os dados para cadastrar uma nova profissão"}
        </p>
      </div>

      <Card className="border-custom-gray/20">
        <CardHeader>
          <CardTitle className="text-xl text-custom-blue">
            Dados da Profissão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Profissão</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Enfermeira, Cuidadora, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva as responsabilidades e atribuições desta profissão" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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

export default ProfessionForm;
