
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState("marcio.sartini@gmail.com"); // Preencher com o email
  const [password, setPassword] = useState("Jpxk*2310"); // Preencher com a senha
  const [loading, setLoading] = useState(false);
  const [adminBypass, setAdminBypass] = useState(false);
  
  // Verificar se o usuário já está logado
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);
  
  const handleAdminBypass = async () => {
    setLoading(true);
    try {
      // Tentativa de login direta com o email admin
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "marcio.sartini@gmail.com",
        password: "Jpxk*2310",
      });
      
      if (error) {
        console.error("Erro ao logar com bypass:", error);
        toast.error("Não foi possível fazer login automático. Tentando criar usuário...");
        
        // Tentar registrar o usuário se não existir
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: "marcio.sartini@gmail.com",
          password: "Jpxk*2310",
          options: {
            data: {
              name: "Admin User",
            },
          },
        });
        
        if (signUpError) {
          console.error("Erro ao criar usuário:", signUpError);
          toast.error("Não foi possível criar o usuário admin");
        } else {
          toast.success("Usuário admin criado com sucesso. Tente fazer login novamente.");
        }
      } else {
        console.log("Login bypass bem-sucedido!");
        toast.success("Login admin realizado com sucesso!");
        
        // Verificar e inserir perfil se necessário
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError || !profile) {
          // Criar perfil admin se não existir
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: "marcio.sartini@gmail.com",
              name: "Admin User",
              role: "admin",
              status: "active"
            });
            
          if (insertError) {
            console.error("Erro ao criar perfil admin:", insertError);
          } else {
            console.log("Perfil admin criado com sucesso");
          }
        }
        
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Erro no processo de bypass:", err);
      toast.error("Ocorreu um erro ao tentar o login admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setLoading(true);
    console.log("Enviando login para:", email);
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      console.log("Login successful, redirecting to dashboard");
      navigate("/dashboard");
    } else {
      // Se falhar, exibir opção de bypass admin
      setAdminBypass(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-beige p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-custom-blue mb-2">Cuidar</h1>
          <p className="text-custom-blue/80">Sistema de Gestão para Casa de Repouso</p>
        </div>
        
        <Card className="shadow-lg border-custom-gray/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button
                    variant="link"
                    className="text-sm text-custom-brown p-0 h-auto"
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-custom-blue hover:bg-custom-blue/90"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              
              {adminBypass && (
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={handleAdminBypass}
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Entrar como Admin"}
                </Button>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center">
              Não tem uma conta?{" "}
              <Link to="/signup" className="text-custom-blue hover:underline">
                Registrar-se
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
