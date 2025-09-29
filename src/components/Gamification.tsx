import { Card } from "@/components/ui/card";
import { Trophy, Star, Award, Gift } from "lucide-react";
import gamificationIcon from "@/assets/gamification-icon.jpg";

const rewards = [
  {
    icon: Gift,
    title: "Descontos na Cantina",
    points: "500 pts",
    color: "text-primary",
  },
  {
    icon: Star,
    title: "Impressões Grátis",
    points: "300 pts",
    color: "text-secondary",
  },
  {
    icon: Award,
    title: "Vouchers Locais",
    points: "1000 pts",
    color: "text-accent",
  },
];

const Gamification = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl rounded-full" />
            <img 
              src={gamificationIcon} 
              alt="Gamificação e recompensas"
              className="relative rounded-3xl shadow-card w-full"
            />
          </div>
          
          {/* Right Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-card border border-border">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Sistema de Recompensas</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">
              Cada carona vale{" "}
              <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                pontos
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Acumule pontos a cada viagem e troque por benefícios reais no campus. 
              Quanto mais você compartilha, mais você ganha!
            </p>
            
            <div className="space-y-4">
              {rewards.map((reward, index) => {
                const Icon = reward.icon;
                return (
                  <Card key={index} className="p-4 flex items-center gap-4 hover:shadow-glow transition-all">
                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${reward.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{reward.title}</h3>
                      <p className="text-sm text-muted-foreground">{reward.points}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex gap-4 p-6 bg-gradient-primary rounded-2xl text-primary-foreground">
              <Award className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold mb-1">Badges Especiais</h3>
                <p className="text-sm opacity-90">
                  Desbloqueie conquistas como "Pontual", "Eco Rider" e "Mestre das Caronas"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gamification;
