
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserFormValues } from "../schemas/userFormSchema";

interface PasswordSectionProps {
  control: Control<UserFormValues>;
  isEditing: boolean;
  isProtectedUser: boolean;
  loading: boolean;
}

export const PasswordSection: React.FC<PasswordSectionProps> = ({ 
  control, 
  isEditing,
  isProtectedUser,
  loading 
}) => {
  return (
    <>
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{isEditing ? "Nova Senha (opcional)" : "Senha"}</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                {...field} 
                disabled={loading || isProtectedUser} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmar Senha</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                {...field} 
                disabled={loading || isProtectedUser} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
