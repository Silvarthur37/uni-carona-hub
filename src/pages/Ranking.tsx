import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, Award, Medal } from "lucide-react";

const Ranking = () => {
  const [user, setUser] = useState<any>(null);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      fetchRanking(user.id);
    } catch (error: any) {
      console.error("Erro ao carregar usuário:", error);
    }
  };

  const fetchRanking = async (userId: string) => {
    try {
      // Top 10 usuários
      const { data: topData } = await supabase
        .from("user_points")
        .select(
          `
          *,
          profiles (
            full_name,
            course
          )
        `
        )
        .order("points", { ascending: false })
        .limit(10);

      setTopUsers(topData || []);

      // Posição do usuário atual
      const { data: myData } = await supabase
        .from("user_points")
        .select(
          `
          *,
          profiles (
            full_name,
            course
          )
        `
        )
        .eq("user_id", userId)
        .single();

      setMyRank(myData);

      // Todos os badges
      const { data: allBadges } = await supabase
        .from("badges")
        .select("*")
        .order("points_required", { ascending: true });

      setBadges(allBadges || []);

      // Badges conquistados pelo usuário
      const { data: userBadgesData } = await supabase
        .from("user_badges")
        .select(
          `
          *,
          badges (
            *
          )
        `
        )
        .eq("user_id", userId);

      setMyBadges(userBadgesData || []);
    } catch (error: any) {
      console.error("Erro ao buscar ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            <h1 className="text-xl font-bold">Ranking & Badges</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Minha Posição */}
        {myRank && (
          <Card className="p-6 mb-8 bg-gradient-primary text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {myRank.profiles?.full_name?.charAt(0) || "?"}
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {myRank.profiles?.full_name}
                  </div>
                  <div className="opacity-90">{myRank.profiles?.course}</div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">{myRank.points}</div>
                <div className="opacity-90">pontos</div>
              </div>
            </div>
          </Card>
        )}

        {/* Top 10 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Medal className="w-6 h-6 text-accent" />
            Top 10 Usuários
          </h2>

          <div className="space-y-3">
            {topUsers.map((userPoint, index) => (
              <Card
                key={userPoint.id}
                className={`p-4 transition-all hover:shadow-glow ${
                  index === 0
                    ? "border-2 border-accent"
                    : index === 1
                    ? "border-2 border-secondary"
                    : index === 2
                    ? "border-2 border-primary"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        index === 0
                          ? "bg-gradient-to-br from-accent to-purple-500 text-white"
                          : index === 1
                          ? "bg-gradient-to-br from-secondary to-secondary-glow text-white"
                          : index === 2
                          ? "bg-gradient-primary text-white"
                          : "bg-muted"
                      }`}
                    >
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </div>
                    <div>
                      <div className="font-bold">
                        {userPoint.profiles?.full_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userPoint.profiles?.course || "Estudante"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {userPoint.points}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {userPoint.total_rides_as_driver +
                        userPoint.total_rides_as_passenger}{" "}
                      caronas
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-accent" />
            Conquistas
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => {
              const earned = myBadges.some((mb) => mb.badge_id === badge.id);
              return (
                <Card
                  key={badge.id}
                  className={`p-6 text-center transition-all ${
                    earned
                      ? "border-2 border-accent hover:shadow-glow"
                      : "opacity-50 grayscale"
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="font-bold mb-1">{badge.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {badge.description}
                  </div>
                  <div className="text-xs text-primary font-medium">
                    {badge.points_required} pontos
                  </div>
                  {earned && (
                    <div className="mt-2 text-xs text-accent font-bold">
                      ✓ Conquistado
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
