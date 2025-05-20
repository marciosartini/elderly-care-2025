
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Profession } from "@/lib/professionStore";
import { UseFormReturn } from "react-hook-form";
import PhotoUpload from "./PhotoUpload";

interface ProfessionalInfoFormProps {
  form: UseFormReturn<any>;
  professions: Profession[];
  photoPreview: string | null;
  setPhotoPreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const ProfessionalInfoForm = ({
  form,
  professions,
  photoPreview,
  setPhotoPreview,
}: ProfessionalInfoFormProps) => {
  return (
    <>
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

        <PhotoUpload 
          photoPreview={photoPreview} 
          setPhotoPreview={setPhotoPreview} 
          form={form} 
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
    </>
  );
};

export default ProfessionalInfoForm;
