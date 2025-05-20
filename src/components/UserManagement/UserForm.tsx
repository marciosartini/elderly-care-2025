
import { User } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { BasicInfoSection } from "./FormSections/BasicInfoSection";
import { RoleAndStatusSection } from "./FormSections/RoleAndStatusSection";
import { AccessLevelSection } from "./FormSections/AccessLevelSection";
import { PasswordSection } from "./FormSections/PasswordSection";
import { useUserForm } from "./hooks/useUserForm";

interface UserFormProps {
  user?: User;
  onCancel: () => void;
  onSuccess: () => void;
}

const UserForm = ({ user, onCancel, onSuccess }: UserFormProps) => {
  const { form, loading, isEditing, isProtectedUser, handleSubmit } = useUserForm({
    user,
    onSuccess,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Editar Usuário" : "Novo Usuário"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <BasicInfoSection 
              control={form.control}
              isEditing={isEditing}
              isProtectedUser={isProtectedUser}
              loading={loading}
            />

            <RoleAndStatusSection 
              control={form.control}
              isProtectedUser={isProtectedUser}
              loading={loading}
            />

            <AccessLevelSection 
              control={form.control}
              isProtectedUser={isProtectedUser}
              loading={loading}
            />

            <PasswordSection 
              control={form.control}
              isEditing={isEditing}
              isProtectedUser={isProtectedUser}
              loading={loading}
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
