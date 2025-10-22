import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const SearchRides = () => {
  const [user, setUser] = useState<any>(null);
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Subscription para atualizações em tempo real
    const channel = supabase
      .channel('rides-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides'
        },
        () => {
          fetchRides();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ride_participants'
        },
        () => {
          fetchRides();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    fetchRides();
  };

  const fetchRides = async () => {
    try {
      const { data, error } = await supabase
        .from("rides")
        .select(
          `
          *,
          profiles!rides_driver_id_fkey (
            full_name,
            avatar_url,
            course
          ),
          ride_participants!ride_participants_ride_id_fkey (
            id,
            status
          )
        `
        )
        .eq("status", "pendente")
        .gte("departure_time", new Date().toISOString())
        .order("departure_time", { ascending: true });

      if (error) throw error;
      
      // Calcular vagas disponíveis considerando participantes confirmados
      const ridesWithAvailableSeats = (data || []).map(ride => {
        const confirmedParticipants = ride.ride_participants?.filter(
          (p: any) => p.status === "confirmado"
        ).length || 0;
        
        return {
          ...ride,
          remainingSeats: ride.available_seats - confirmedParticipants
        };
      }).filter(ride => ride.remainingSeats > 0); // Mostrar apenas com vagas disponíveis
      
      setRides(ridesWithAvailableSeats);
    } catch (error: any) {
      console.error("Erro ao buscar caronas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRide = async (rideId: string) => {
    try {
      const { error } = await supabase.from("ride_participants").insert({
        ride_id: rideId,
        passenger_id: user.id,
        status: "pendente",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Já solicitado",
            description: "Você já solicitou esta carona",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Solicitação enviada!",
        description: "Aguarde a confirmação do motorista",
      });

      fetchRides();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredRides = rides.filter(
    (ride) =>
      ride.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Search className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">Buscar Caronas</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por origem ou destino..."
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando caronas...</p>
          </div>
        ) : filteredRides.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">Nenhuma carona encontrada</h3>
            <p className="text-muted-foreground">
              Tente buscar por outros destinos ou seja o primeiro a oferecer uma
              carona!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRides.map((ride) => (
              <Card
                key={ride.id}
                className="p-6 hover:shadow-glow transition-all cursor-pointer"
                onClick={() => navigate(`/ride/${ride.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                      {ride.profiles?.full_name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <div className="font-bold">{ride.profiles?.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {ride.profiles?.course || "Estudante"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium">De:</span>
                    <span className="text-muted-foreground">{ride.origin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span className="font-medium">Para:</span>
                    <span className="text-muted-foreground">
                      {ride.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {format(
                        new Date(ride.departure_time),
                        "dd 'de' MMMM 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className={ride.remainingSeats <= 2 ? "text-destructive font-medium" : ""}>
                        {ride.remainingSeats} {ride.remainingSeats === 1 ? "vaga" : "vagas"}
                      </span>
                    </div>
                    {ride.price && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>R$ {parseFloat(ride.price).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="hero"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestRide(ride.id);
                    }}
                  >
                    Solicitar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRides;
