
import { useState, useEffect } from "react";
import { User, usersStore } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

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

const UserForm = ({ user, onCancel, onSuccess }: UserFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [status, setStatus] = useState<"active" | "pending">("active");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accessLevel, setAccessLevel] = useState<"basic" | "full" | "limited">("basic");
  const [loading, setLoading] = useState(false);
  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status as "active" | "pending");
      // Safely access accessLevel if it exists
      setAccessLevel((user as ExtendedUser).accessLevel || "basic");
    }
  }, [user]);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return false;
    }

    if (!email.trim()) {
      toast.error("Email é obrigatório");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email inválido");
      return false;
    }

    if (!isEditing && !password) {
      toast.error("Senha é obrigatória para novos usuários");
      return false;
    }

    if (password && password.length < 6) {
      toast.error("Senha deve ter pelo menos 6 caracteres");
      return false;
    }

    if (password && password !== confirmPassword) {
      toast.error("Senhas não coincidem");
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isEditing && user) {
        const updateData: Partial<ExtendedUser> = {
          name,
          email,
          role,
          status: status as "active" | "pending",
          accessLevel
        };

        // Only update password if provided
        if (password) {
          updateData.password = password;
        }

        usersStore.updateUser(user.id, updateData as Partial<User>);
        toast.success("Usuário atualizado com sucesso");
      } else {
        usersStore.addUser({
          name,
          email,
          role,
          status: 'active', // Admin creates active users
          accessLevel,
          password: password
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
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || (isEditing && user?.email === 'msartini@gmail.com')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Função</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "admin" | "user")}
                disabled={loading || (isEditing && user?.email === 'msartini@gmail.com')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as "active" | "pending")}
                disabled={loading || (isEditing && user?.email === 'msartini@gmail.com')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  {/* Removed "inactive" option since it's not in the expected type */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accessLevel">Nível de Acesso</Label>
            <Select
              value={accessLevel}
              onValueChange={(value) => setAccessLevel(value as "basic" | "full" | "limited")}
              disabled={loading || (isEditing && user?.email === 'msartini@gmail.com')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um nível de acesso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limited">Limitado</SelectItem>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="full">Completo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password field - shown always for new users, optional for editing */}
          <div className="space-y-2">
            <Label htmlFor="password">{isEditing ? "Nova Senha (opcional)" : "Senha"}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required={!isEditing}
            />
          </div>

          {(password || !isEditing) && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required={!isEditing || !!password}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="bg-custom-blue hover:bg-custom-blue/90">
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserForm;
