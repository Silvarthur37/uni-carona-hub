import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const PrivateChat = () => {
  const { userId } = useParams();
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("ride");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
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
    if (currentUser && otherUser) {
      fetchMessages();
      subscribeToMessages();
      markMessagesAsRead();
    }
  }, [currentUser, otherUser]);

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
    setCurrentUser(user);
    fetchOtherUserProfile();
  };

  const fetchOtherUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setOtherUser(data);
    } catch (error: any) {
      console.error("Erro ao buscar perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil do usuário",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("private_messages")
        .select(
          `
          *,
          sender:profiles!private_messages_sender_id_fkey (
            full_name,
            avatar_url
          ),
          receiver:profiles!private_messages_receiver_id_fkey (
            full_name,
            avatar_url
          )
        `
        )
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar mensagens:", error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`private_chat:${currentUser.id}:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "private_messages",
          filter: `sender_id=eq.${userId}`,
        },
        async (payload) => {
          const { data: newMsg } = await supabase
            .from("private_messages")
            .select(
              `
            *,
            sender:profiles!private_messages_sender_id_fkey (
              full_name,
              avatar_url
            ),
            receiver:profiles!private_messages_receiver_id_fkey (
              full_name,
              avatar_url
            )
          `
            )
            .eq("id", payload.new.id)
            .single();

          if (newMsg && newMsg.receiver_id === currentUser.id) {
            setMessages((prev) => [...prev, newMsg]);
            markMessagesAsRead();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from("private_messages")
        .update({ read: true })
        .eq("receiver_id", currentUser.id)
        .eq("sender_id", userId)
        .eq("read", false);
    } catch (error: any) {
      console.error("Erro ao marcar mensagens como lidas:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from("private_messages").insert({
        sender_id: currentUser.id,
        receiver_id: userId,
        ride_id: rideId,
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

  if (!otherUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Usuário não encontrado</h3>
          <Button onClick={() => navigate("/my-rides")}>
            Voltar para Minhas Caronas
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
              {otherUser.full_name?.charAt(0) || "?"}
            </div>
            <div>
              <h1 className="text-lg font-bold">{otherUser.full_name}</h1>
              {otherUser.course && (
                <p className="text-sm text-muted-foreground">{otherUser.course}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-6 max-w-4xl h-full">
          <Card className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma mensagem ainda</p>
                  <p className="text-sm">Inicie a conversa!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isOwn = message.sender_id === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {isOwn
                          ? currentUser.user_metadata?.full_name?.charAt(0) || "?"
                          : otherUser.full_name?.charAt(0) || "?"}
                      </div>
                      <div
                        className={`flex-1 max-w-[70%] ${
                          isOwn ? "items-end" : "items-start"
                        }`}
                      >
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
                <Button type="submit" disabled={!newMessage.trim()}>
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

export default PrivateChat;
