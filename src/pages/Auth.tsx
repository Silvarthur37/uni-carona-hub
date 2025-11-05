import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Car, Sparkles } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Bem-vindo de volta!",
          description: "Login realizado com sucesso",
        });
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (error) throw error;

        toast({
          title: "Conta criada!",
          description: "Bem-vindo ao PickMe Trip",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <Card className="w-full max-w-md p-8 shadow-glow">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">PickMe Trip</h1>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={isLogin ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setIsLogin(true)}
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setIsLogin(false)}
          >
            Cadastro
          </Button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                placeholder="Seu nome"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            variant="hero"
          >
            {loading ? (
              "Carregando..."
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {isLogin ? "Entrar" : "Criar Conta"}
              </>
            )}
          </Button>
        </form>

        <div className="space-y-2 mt-4">
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Novo por aqui? " : "Já tem uma conta? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? "Criar conta" : "Fazer login"}
            </button>
          </p>

          {isLogin && (
            <p className="text-center text-sm text-muted-foreground">
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-primary font-medium hover:underline"
              >
                Esqueceu sua senha?
              </button>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Auth;
