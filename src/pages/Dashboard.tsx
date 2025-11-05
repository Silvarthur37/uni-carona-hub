import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";
import { Notifications } from "@/components/Notifications";
import {
  Car,
  Plus,
  Search,
  Trophy,
  User,
  MessageSquare,
  LogOut,
  Leaf,
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [points, setPoints] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/auth");
        return;
      }

      setUser(user);

      // Buscar perfil
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // Buscar pontos
      const { data: pointsData } = await supabase
        .from("user_points")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setPoints(pointsData);
    } catch (error: any) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast({
      title: "Até logo!",
      description: "Você saiu da sua conta",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">PickMe Trip</span>
          </div>

          <div className="flex items-center gap-2">
            <Notifications />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
            >
              <User className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Bem-vindo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Olá, {profile?.full_name || "Usuário"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Pronto para sua próxima carona?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{points?.points || 0}</div>
                <div className="text-sm text-muted-foreground">Pontos</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Car className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(points?.total_rides_as_driver || 0) +
                    (points?.total_rides_as_passenger || 0)}
                </div>
                <div className="text-sm text-muted-foreground">Caronas</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {points?.co2_saved_kg || 0}kg
                </div>
                <div className="text-sm text-muted-foreground">CO₂ Salvo</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Ações Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card
            className="p-8 hover:shadow-glow transition-all cursor-pointer group"
            onClick={() => navigate("/create-ride")}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Oferecer Carona</h3>
                <p className="text-muted-foreground">
                  Seja um motorista e ganhe pontos
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 hover:shadow-glow transition-all cursor-pointer group"
            onClick={() => navigate("/search-rides")}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-secondary-glow flex items-center justify-center group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Buscar Carona</h3>
                <p className="text-muted-foreground">
                  Encontre caronas para seu destino
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Ações Secundárias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-20 justify-start gap-4"
            onClick={() => navigate("/ranking")}
          >
            <Trophy className="w-6 h-6 text-accent" />
            <div className="text-left">
              <div className="font-bold">Ranking & Badges</div>
              <div className="text-sm text-muted-foreground">
                Veja sua posição
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="h-20 justify-start gap-4"
            onClick={() => navigate("/my-rides")}
          >
            <MessageSquare className="w-6 h-6 text-primary" />
            <div className="text-left">
              <div className="font-bold">Minhas Caronas</div>
              <div className="text-sm text-muted-foreground">
                Gerencie suas viagens
              </div>
            </div>
          </Button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Dashboard;
