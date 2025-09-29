import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Rocket, Download } from "lucide-react";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-12 md:p-20 text-center shadow-glow">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-glow/20 to-transparent" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <Rocket className="w-16 h-16 mx-auto text-primary-foreground animate-float" />
            
            <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground">
              Pronto para transformar sua mobilidade?
            </h2>
            
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Junte-se a milhares de estudantes que já economizam tempo, dinheiro e ajudam o planeta
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg bg-white text-primary hover:bg-white/90 shadow-xl"
                onClick={() => navigate("/auth")}
              >
                <Download className="w-5 h-5" />
                Começar Agora
              </Button>
              <Button 
                size="lg" 
                variant="heroOutline"
                className="text-lg border-white text-white hover:bg-white hover:text-primary"
              >
                Saiba Mais
              </Button>
            </div>
            
            <p className="text-sm text-primary-foreground/80">
              Disponível para iOS e Android • 100% Gratuito
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
