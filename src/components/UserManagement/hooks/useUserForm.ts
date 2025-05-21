
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@/types/user";
import { supabaseUserStore } from "@/stores/supabaseUserStore";
import { userFormSchema, UserFormValues } from "../schemas/userFormSchema";
import { toast } from "sonner";

interface UseUserFormProps {
  user?: User;
  onSuccess: () => void;
}

export const useUserForm = ({ user, onSuccess }: UseUserFormProps) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!user;
  const isProtectedUser = isEditing && user?.email === 'msartini@gmail.com';

  // Initialize form with user data or defaults
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "user",
      status: (user?.status as "active" | "pending") || "active",
      accessLevel: user?.accessLevel || "basic",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: UserFormValues) => {
    setLoading(true);

    try {
      if (isEditing && user) {
        const updateData: Partial<User> = {
          name: values.name,
          role: values.role,
          status: values.status,
          accessLevel: values.accessLevel
        };

        // Only update password if provided
        if (values.password) {
          // Since we updated our User type to include password, this is now type-safe
          updateData.password = values.password;
        }

        const success = await supabaseUserStore.updateUser(user.id, updateData);
        if (success) {
          toast.success("Usuário atualizado com sucesso");
          onSuccess();
        }
      } else {
        const success = await supabaseUserStore.addUser({
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status,
          accessLevel: values.accessLevel,
          password: values.password
        });
        
        if (success) {
          toast.success("Usuário criado com sucesso");
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Erro ao salvar usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    isEditing,
    isProtectedUser,
    handleSubmit: form.handleSubmit(handleSubmit)
  };
};
