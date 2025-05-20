
import { useState, useEffect } from "react";
import { User, usersStore } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UserFormProps {
  user?: User;
  onCancel: () => void;
  onSuccess: () => void;
}

// Define a type that extends User with the optional fields we're using
interface ExtendedUser extends User {
  accessLevel?: "basic" | "full" | "limited";
  password?: string;
}

// Define the access levels, roles, and status options
const ACCESS_LEVELS = [
  { value: "limited", label: "Limitado" },
  { value: "basic", label: "Básico" },
  { value: "full", label: "Completo" }
];

const USER_ROLES = [
  { value: "user", label: "Usuário" },
  { value: "admin", label: "Administrador" }
];

const USER_STATUSES = [
  { value: "active", label: "Ativo" },
  { value: "pending", label: "Pendente" }
];

// Form schema
const userFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "user"]),
  status: z.enum(["active", "pending"]),
  accessLevel: z.enum(["basic", "full", "limited"]),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal(''))
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

const UserForm = ({ user, onCancel, onSuccess }: UserFormProps) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!user;
  const isProtectedUser = isEditing && user?.email === 'msartini@gmail.com';

  // Initialize form with user data or defaults
  const form = useForm<z.infer<typeof userFormSchema>>({
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

  const handleSubmit = (values: z.infer<typeof userFormSchema>) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Usuário" : "Novo Usuário"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
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
              control={form.control}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={loading || isProtectedUser}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USER_ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={loading || isProtectedUser}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {USER_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
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

            <FormField
              control={form.control}
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
              control={form.control}
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
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-custom-blue hover:bg-custom-blue/90"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default UserForm;
