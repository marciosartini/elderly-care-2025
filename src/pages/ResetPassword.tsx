
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hashExist, setHashExist] = useState(false);
  
  useEffect(() => {
    const checkHash = async () => {
      // Check if we have a valid hash from the URL
      const hash = window.location.hash.substring(1);
      if (hash && hash.includes('type=recovery')) {
        setHashExist(true);
      } else {
        toast.error("Link de recuperação inválido");
        navigate("/");
      }
    };
    
    checkHash();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast.success("Senha redefinida com sucesso");
      navigate("/");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!hashExist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-custom-beige p-4">
        <Card>
          <CardHeader>
            <CardTitle>Redirecionando...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Verificando link de recuperação...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-beige p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-custom-blue mb-2">Cuidar</h1>
          <p className="text-custom-blue/80">Sistema de Gestão para Casa de Repouso</p>
        </div>
        
        <Card className="shadow-lg border-custom-gray/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Nova Senha</CardTitle>
            <CardDescription className="text-center">
              Digite sua nova senha
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-custom-blue hover:bg-custom-blue/90"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar Nova Senha"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => navigate("/")}
              className="text-custom-brown"
            >
              Voltar para o login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
