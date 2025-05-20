
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, usersStore } from "@/contexts/AuthContext";
import { userFormSchema, UserFormValues } from "../schemas/userFormSchema";
import { toast } from "sonner";

// Define a type that extends User with the optional fields we're using
interface ExtendedUser extends User {
  accessLevel?: "basic" | "full" | "limited";
  password?: string;
}

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
      accessLevel: (user as ExtendedUser)?.accessLevel || "basic",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: UserFormValues) => {
    setLoading(true);

    try {
      if (isEditing && user) {
        const updateData: Partial<ExtendedUser> = {
          name: values.name,
          role: values.role,
          status: values.status,
          accessLevel: values.accessLevel
        };

        // Only update password if provided
        if (values.password) {
          updateData.password = values.password;
        }

        usersStore.updateUser(user.id, updateData as Partial<User>);
        toast.success("Usuário atualizado com sucesso");
      } else {
        usersStore.addUser({
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status,
          accessLevel: values.accessLevel,
          password: values.password
        } as Omit<User, "id" | "createdAt">);
        toast.success("Usuário criado com sucesso");
      }
      
      onSuccess();
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
