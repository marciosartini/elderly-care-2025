
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACCESS_LEVELS } from "../constants/userFormConstants";
import { UserFormValues } from "../schemas/userFormSchema";

interface AccessLevelSectionProps {
  control: Control<UserFormValues>;
  isProtectedUser: boolean;
  loading: boolean;
}

export const AccessLevelSection: React.FC<AccessLevelSectionProps> = ({ 
  control, 
  isProtectedUser,
  loading 
}) => {
  return (
    <FormField
      control={control}
      name="accessLevel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nível de Acesso</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={loading || isProtectedUser}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um nível de acesso" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {ACCESS_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
