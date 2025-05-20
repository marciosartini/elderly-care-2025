
import * as z from "zod";

// Form schema
export const userFormSchema = z.object({
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

export type UserFormValues = z.infer<typeof userFormSchema>;
