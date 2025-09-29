import { Button } from "@/components/ui/button";
import { Car, Sparkles, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-card border border-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Mobilidade inteligente para universitários</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Seu Campus em{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Movimento
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Conecte-se com colegas, economize dinheiro e ajude o planeta. 
              UniRide transforma cada viagem em uma experiência única.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg">
                <Users className="w-5 h-5" />
                Começar Agora
              </Button>
              <Button variant="heroOutline" size="lg" className="text-lg">
                <Car className="w-5 h-5" />
                Como Funciona
              </Button>
            </div>
            
            <div className="flex items-center gap-8 justify-center lg:justify-start text-sm">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-muted-foreground">Estudantes</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-secondary">50k+</div>
                <div className="text-muted-foreground">Caronas</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-accent">100+</div>
                <div className="text-muted-foreground">Universidades</div>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-glow opacity-20 blur-3xl rounded-full animate-glow" />
            <img 
              src={heroImage} 
              alt="Estudantes compartilhando carona"
              className="relative rounded-3xl shadow-glow animate-float w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
