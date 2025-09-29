import { Card } from "@/components/ui/card";
import { Users, Trophy, Shield, Leaf, Music, Calendar } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Match Inteligente",
    description: "Algoritmo conecta você com colegas do mesmo curso e horários similares.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: Trophy,
    title: "Gamificação",
    description: "Acumule pontos, ganhe badges e troque por recompensas no campus.",
    gradient: "from-accent to-purple-400",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Verificação de identidade, avaliações e botão SOS integrado.",
    gradient: "from-blue-500 to-primary",
  },
  {
    icon: Leaf,
    title: "Impacto Ambiental",
    description: "Veja quanto CO₂ você economizou e contribua para um planeta melhor.",
    gradient: "from-secondary to-secondary-glow",
  },
  {
    icon: Music,
    title: "Carona Musical",
    description: "Integração com Spotify para criar a playlist perfeita da viagem.",
    gradient: "from-pink-500 to-accent",
  },
  {
    icon: Calendar,
    title: "Caronas Recorrentes",
    description: "Agende caronas semanais e crie sua rotina de mobilidade.",
    gradient: "from-secondary to-primary",
  },
];

const Features = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Funcionalidades que fazem a{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              diferença
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Muito mais que um app de caronas, uma experiência completa para universitários
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
