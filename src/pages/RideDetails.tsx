import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Send,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const RideDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [ride, setRide] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (ride && user) {
      subscribeToMessages();
    }
  }, [ride, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUser(user);
    fetchRideDetails(user.id);
  };

  const fetchRideDetails = async (userId: string) => {
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
          ride_participants (
            id,
            status,
            profiles (
              id,
              full_name,
              avatar_url
            )
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      setRide(data);
      fetchMessages();
    } catch (error: any) {
      console.error("Erro ao buscar detalhes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da carona",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          *,
          profiles (
            full_name,
            avatar_url
          )
        `
        )
        .eq("ride_id", id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`messages:${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `ride_id=eq.${id}`,
        },
        async (payload) => {
          const { data: newMsg } = await supabase
            .from("messages")
            .select(
              `
            *,
            profiles (
              full_name,
              avatar_url
            )
          `
            )
            .eq("id", payload.new.id)
            .single();

          if (newMsg) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        ride_id: id,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
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

  if (!ride) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Carona não encontrada</h3>
          <Button onClick={() => navigate("/dashboard")}>
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/my-rides")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">Detalhes da Carona</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 max-w-4xl h-full flex flex-col">
          {/* Informações da Carona */}
          <Card className="p-6 mb-4">
            <div className="flex items-center gap-3 mb-4">
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

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">De:</span>
                <span className="text-muted-foreground">{ride.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="font-medium">Para:</span>
                <span className="text-muted-foreground">{ride.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {format(
                    new Date(ride.departure_time),
                    "dd 'de' MMMM 'às' HH:mm",
                    { locale: ptBR }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{ride.available_seats} vagas disponíveis</span>
              </div>
            </div>

            {ride.description && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">{ride.description}</p>
              </div>
            )}
          </Card>

          {/* Chat */}
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <h3 className="font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat da Carona
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">Seja o primeiro a enviar uma mensagem!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {message.profiles?.full_name?.charAt(0) || "?"}
                      </div>
                      <div
                        className={`flex-1 max-w-[70%] ${
                          isOwn ? "items-end" : "items-start"
                        }`}
                      >
                        {!isOwn && (
                          <div className="text-xs text-muted-foreground mb-1">
                            {message.profiles?.full_name}
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl ${
                            isOwn
                              ? "bg-gradient-primary text-white"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {format(new Date(message.created_at), "HH:mm")}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-border bg-card"
            >
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button type="submit" variant="hero" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RideDetails;
