import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar email de recuperação",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-4">
      <Card className="w-full max-w-md p-8 shadow-glow">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/auth")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Recuperar Senha</h1>
          </div>
        </div>

        {!emailSent ? (
          <>
            <p className="text-muted-foreground mb-6">
              Digite seu email cadastrado e enviaremos um link para redefinir sua senha.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-4">
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

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                variant="hero"
              >
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
            </form>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm">
                Um email foi enviado para <strong>{email}</strong>. 
                Clique no link recebido para redefinir sua senha.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/auth")}
            >
              Voltar para Login
            </Button>

            <button
              onClick={() => setEmailSent(false)}
              className="text-sm text-muted-foreground hover:text-primary w-full text-center"
            >
              Não recebeu o email? Tentar novamente
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
