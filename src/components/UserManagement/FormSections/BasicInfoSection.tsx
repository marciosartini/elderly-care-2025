
import React from "react";
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserFormValues } from "../schemas/userFormSchema";

interface BasicInfoSectionProps {
  control: Control<UserFormValues>;
  isEditing: boolean;
  isProtectedUser: boolean;
  loading: boolean;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ 
  control, 
  isEditing,
  isProtectedUser,
  loading 
}) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input 
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
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                disabled={loading || isEditing} // Email can't be edited for existing users
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
