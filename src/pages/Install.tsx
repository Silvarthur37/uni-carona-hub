import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Download, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <img 
            src="/pwa-512x512.png" 
            alt="PickMe Trip" 
            className="w-32 h-32 mx-auto mb-4 rounded-3xl shadow-lg"
          />
          <h1 className="text-3xl font-bold mb-2">PickMe Trip</h1>
          <p className="text-muted-foreground">
            Instale o app para uma experiência completa
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Instalar Aplicativo
            </CardTitle>
            <CardDescription>
              Tenha acesso rápido direto da sua tela inicial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isInstalled ? (
              <div className="flex items-center justify-center gap-2 py-8 text-green-600">
                <Check className="w-6 h-6" />
                <span className="font-semibold">App já instalado!</span>
              </div>
            ) : isInstallable ? (
              <Button 
                onClick={handleInstallClick} 
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Instalar Agora
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Para instalar o PickMe Trip no seu dispositivo:
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="font-semibold">Android (Chrome/Edge):</div>
                  <ol className="list-decimal list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Toque no menu (⋮) do navegador</li>
                    <li>Selecione "Instalar app" ou "Adicionar à tela inicial"</li>
                    <li>Confirme a instalação</li>
                  </ol>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="font-semibold">iOS (Safari):</div>
                  <ol className="list-decimal list-inside space-y-1 ml-2 text-muted-foreground">
                    <li>Toque no botão compartilhar (□ com seta)</li>
                    <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
                    <li>Confirme tocando em "Adicionar"</li>
                  </ol>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2 text-sm">Benefícios do App:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  Acesso rápido pela tela inicial
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  Funciona offline (conteúdo em cache)
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  Experiência otimizada para mobile
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                  Atualizações automáticas
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate("/")}
        >
          Voltar para o site
        </Button>
      </div>
    </div>
  );
};

export default Install;
