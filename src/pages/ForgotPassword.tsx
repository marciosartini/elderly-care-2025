import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '@/contexts/auth/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setLoading(true);
    const success = await forgotPassword(email);
    setLoading(false);
    
    if (success) {
      setSubmitted(true);
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
            <CardTitle className="text-2xl text-center">Recuperar Senha</CardTitle>
            <CardDescription className="text-center">
              {!submitted 
                ? "Digite seu e-mail para receber instruções de recuperação" 
                : "Verifique seu e-mail para redefinir sua senha"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!submitted ? (
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
                <Button 
                  type="submit" 
                  className="w-full bg-custom-blue hover:bg-custom-blue/90"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar instruções"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Se houver uma conta associada a {email}, você receberá um e-mail com instruções para redefinir sua senha.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/" className="text-custom-brown hover:underline">
              Voltar para o login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
