import { Card } from "@/components/ui/card";
import { Leaf, TrendingDown, Users, TreePine } from "lucide-react";
import ecoIcon from "@/assets/eco-icon.jpg";

const stats = [
  {
    icon: TrendingDown,
    value: "500kg",
    label: "CO₂ reduzido",
    color: "text-secondary",
  },
  {
    icon: Users,
    value: "2,500",
    label: "Caronas compartilhadas",
    color: "text-primary",
  },
  {
    icon: TreePine,
    value: "50",
    label: "Árvores equivalentes",
    color: "text-secondary",
  },
];

const EcoImpact = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-card border border-border">
              <Leaf className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">Impacto Sustentável</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold">
              Juntos por um{" "}
              <span className="bg-gradient-to-r from-secondary to-secondary-glow bg-clip-text text-transparent">
                planeta melhor
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Cada carona compartilhada reduz emissões e ajuda a construir um futuro mais sustentável. 
              Acompanhe seu impacto e veja a diferença que você faz.
            </p>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="p-6 text-center hover:shadow-glow transition-all">
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                );
              })}
            </div>
            
            <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-bold mb-2">Painel Coletivo</h3>
                  <p className="text-sm text-muted-foreground">
                    "Nossa universidade já reduziu 50 toneladas de CO₂ com UniRide!"
                  </p>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 to-primary/20 blur-3xl rounded-full animate-glow" />
            <img 
              src={ecoIcon} 
              alt="Impacto ambiental"
              className="relative rounded-3xl shadow-glow w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcoImpact;
