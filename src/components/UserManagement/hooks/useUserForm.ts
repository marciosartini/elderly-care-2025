import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { userFormSchema } from "../schemas/userFormSchema";
import { supabaseUserStore } from "@/stores/supabaseUserStore";
import { User } from "@/types/user";

// Create an explicit type for access level to fix the TypeScript error
type AccessLevel = 'basic' | 'limited' | 'full';

export const useUserForm = (user: User | undefined, onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);

  const defaultValues = {
    email: user?.email || "",
    name: user?.name || "",
    role: user?.role || "user",
    status: user?.status || "pending",
    password: "",
    confirmPassword: "",
    accessLevel: (user?.accessLevel || "basic") as AccessLevel, // Type assertion fixes the error
  };

  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    setLoading(true);
    try {
      if (user) {
        // Update existing user
        const updateData: Partial<User> = {
          name: values.name,
          role: values.role,
          status: values.status,
          accessLevel: values.accessLevel,
        };

        // Conditionally update password if it's provided
        if (values.password) {
          updateData.password = values.password;
        }

        const success = await supabaseUserStore.updateUser(user.id, updateData);
        if (success) {
          toast.success("Usuário atualizado com sucesso!");
          onSuccess();
        } else {
          toast.error("Falha ao atualizar usuário.");
        }
      } else {
        // Create new user (Edge Function required)
        const newUser: Omit<User, 'id' | 'createdAt'> = {
          email: values.email,
          name: values.name,
          role: values.role,
          status: values.status,
          accessLevel: values.accessLevel,
        };

        const success = await supabaseUserStore.addUser(newUser);
        if (success) {
          toast.success("Usuário criado com sucesso!");
          onSuccess();
        } else {
          toast.error("Falha ao criar usuário.");
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Erro ao salvar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return { form, onSubmit, loading };
};
