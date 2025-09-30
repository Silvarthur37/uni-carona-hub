import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, LogOut, KeyRound, Settings, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    setUser(user);
    setEmail(user.email || "");

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      setFullName(profile.full_name || "");
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Perfil</h1>

        {/* User Avatar and Email */}
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4 bg-primary">
            <AvatarFallback className="text-3xl text-primary-foreground">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
          <p className="text-lg text-muted-foreground">{email}</p>
        </div>

        {/* Menu Options */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            className="w-full justify-start h-16 text-lg font-normal hover:bg-muted"
            onClick={() => navigate("/users")}
          >
            <MessageCircle className="mr-3 h-5 w-5" />
            Conversar com Usuários
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-16 text-lg font-normal hover:bg-muted"
            onClick={() => {
              toast({
                title: "Em breve",
                description: "Funcionalidade em desenvolvimento",
              });
            }}
          >
            <KeyRound className="mr-3 h-5 w-5" />
            Alterar Senha
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-16 text-lg font-normal hover:bg-muted"
            onClick={() => navigate("/profile/edit")}
          >
            <Settings className="mr-3 h-5 w-5" />
            Gerenciar Dados
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start h-16 text-lg font-normal hover:bg-muted"
            onClick={() => {
              toast({
                title: "Em breve",
                description: "Funcionalidade em desenvolvimento",
              });
            }}
          >
            <HelpCircle className="mr-3 h-5 w-5" />
            Ajuda e Suporte
          </Button>

          <Button
            variant="outline"
            className="w-full h-16 text-lg border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground mt-8"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair (Logout)
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
