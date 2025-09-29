import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Car, Users, MapPin, Calendar, Check, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const MyRides = () => {
  const [user, setUser] = useState<any>(null);
  const [driverRides, setDriverRides] = useState<any[]>([]);
  const [passengerRides, setPassengerRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    fetchMyRides(user.id);
  };

  const fetchMyRides = async (userId: string) => {
    try {
      // Caronas como motorista
      const { data: asDriver } = await supabase
        .from("rides")
        .select(
          `
          *,
          ride_participants (
            id,
            status,
            profiles (
              full_name,
              avatar_url
            )
          )
        `
        )
        .eq("driver_id", userId)
        .order("departure_time", { ascending: false });

      // Caronas como passageiro
      const { data: asPassenger } = await supabase
        .from("ride_participants")
        .select(
          `
          *,
          rides (
            *,
            profiles!rides_driver_id_fkey (
              full_name,
              avatar_url
            )
          )
        `
        )
        .eq("passenger_id", userId)
        .order("created_at", { ascending: false });

      setDriverRides(asDriver || []);
      setPassengerRides(asPassenger || []);
    } catch (error: any) {
      console.error("Erro ao buscar caronas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateParticipantStatus = async (
    participantId: string,
    newStatus: string
  ) => {
    try {
      const { error } = await supabase
        .from("ride_participants")
        .update({ status: newStatus })
        .eq("id", participantId);

      if (error) throw error;

      toast({
        title: "Atualizado!",
        description: `Solicitação ${
          newStatus === "confirmado" ? "aceita" : "recusada"
        }`,
      });

      fetchMyRides(user.id);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
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
            <Car className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">Minhas Caronas</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="driver" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="driver">Como Motorista</TabsTrigger>
            <TabsTrigger value="passenger">Como Passageiro</TabsTrigger>
          </TabsList>

          <TabsContent value="driver">
            {driverRides.length === 0 ? (
              <Card className="p-12 text-center">
                <Car className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">
                  Nenhuma carona oferecida
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece oferecendo sua primeira carona!
                </p>
                <Button onClick={() => navigate("/create-ride")} variant="hero">
                  Oferecer Carona
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {driverRides.map((ride) => (
                  <Card key={ride.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm mb-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span>{ride.origin}</span>
                          <span className="text-muted-foreground">→</span>
                          <span>{ride.destination}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(
                              new Date(ride.departure_time),
                              "dd/MM/yyyy 'às' HH:mm"
                            )}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/ride/${ride.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>

                    {ride.ride_participants?.length > 0 && (
                      <div className="pt-4 border-t border-border space-y-2">
                        <div className="font-medium mb-2">Solicitações:</div>
                        {ride.ride_participants.map((participant: any) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                                {participant.profiles?.full_name?.charAt(0) || "?"}
                              </div>
                              <span className="font-medium">
                                {participant.profiles?.full_name}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  participant.status === "confirmado"
                                    ? "bg-secondary/20 text-secondary"
                                    : participant.status === "recusado"
                                    ? "bg-destructive/20 text-destructive"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {participant.status}
                              </span>
                            </div>

                            {participant.status === "pendente" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    handleUpdateParticipantStatus(
                                      participant.id,
                                      "confirmado"
                                    )
                                  }
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleUpdateParticipantStatus(
                                      participant.id,
                                      "recusado"
                                    )
                                  }
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="passenger">
            {passengerRides.length === 0 ? (
              <Card className="p-12 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Nenhuma carona solicitada</h3>
                <p className="text-muted-foreground mb-4">
                  Busque por caronas disponíveis!
                </p>
                <Button onClick={() => navigate("/search-rides")} variant="hero">
                  Buscar Caronas
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {passengerRides.map((participant) => {
                  const ride = participant.rides;
                  return (
                    <Card key={participant.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                              {ride.profiles?.full_name?.charAt(0) || "?"}
                            </div>
                            <span className="font-medium">
                              {ride.profiles?.full_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mb-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{ride.origin}</span>
                            <span className="text-muted-foreground">→</span>
                            <span>{ride.destination}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {format(
                                new Date(ride.departure_time),
                                "dd/MM/yyyy 'às' HH:mm"
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-medium ${
                              participant.status === "confirmado"
                                ? "bg-secondary/20 text-secondary"
                                : participant.status === "recusado"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {participant.status}
                          </span>
                          {participant.status === "confirmado" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/ride/${ride.id}`)}
                            >
                              Ver Chat
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyRides;
