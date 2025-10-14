import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNav from "@/components/BottomNav";

interface NearbyDriver {
  id: string;
  full_name: string;
  avatar_url: string | null;
  course: string | null;
  university: string | null;
  home_address: string;
  distance_km: number;
}

const NearbyDrivers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [drivers, setDrivers] = useState<NearbyDriver[]>([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/auth");
      return;
    }

    const destLat = searchParams.get("lat");
    const destLng = searchParams.get("lng");
    const destName = searchParams.get("destination");

    if (!destLat || !destLng) {
      toast({
        title: "Erro",
        description: "Coordenadas de destino não informadas.",
        variant: "destructive",
      });
      navigate("/map");
      return;
    }

    setDestination(destName || "Destino");
    await fetchNearbyDrivers(Number(destLat), Number(destLng));
  };

  const fetchNearbyDrivers = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_nearby_drivers", {
        destination_lat: lat,
        destination_lng: lng,
        max_distance_km: 10, // 10km de raio
      });

      if (error) throw error;

      setDrivers(data || []);
    } catch (error) {
      console.error("Error fetching nearby drivers:", error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar motoristas próximos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewProfile = (driverId: string) => {
    // Navegar para o perfil do motorista ou iniciar chat
    navigate(`/chat/${driverId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Buscando motoristas próximos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/map")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Motoristas Próximos</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {destination}
            </p>
          </div>
        </div>

        {drivers.length === 0 ? (
          <Card className="p-8 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhum motorista encontrado
            </h3>
            <p className="text-muted-foreground">
              Não encontramos motoristas com endereço próximo ao seu destino.
              Tente outro destino ou amplie a busca.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Encontramos {drivers.length} motorista(s) que mora(m) perto do seu
              destino
            </p>

            {drivers.map((driver) => (
              <Card
                key={driver.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewProfile(driver.id)}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={driver.avatar_url || undefined} />
                    <AvatarFallback>
                      {getInitials(driver.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {driver.full_name}
                        </h3>
                        {driver.course && (
                          <p className="text-sm text-muted-foreground">
                            {driver.course}
                            {driver.university && ` - ${driver.university}`}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {driver.distance_km.toFixed(1)} km
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-start gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{driver.home_address}</span>
                    </div>

                    <div className="mt-3">
                      <Button size="sm" className="w-full sm:w-auto">
                        Enviar Mensagem
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default NearbyDrivers;
