import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, MessageSquare, CheckCheck, Check } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

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
      // Security: Only select public profile fields, exclude sensitive data like phone
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, course, university")
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

    const messageContent = newMessage.trim();
    setNewMessage("");

    try {
      const { error } = await supabase.from("private_messages").insert({
        sender_id: currentUser.id,
        receiver_id: userId,
        ride_id: rideId,
        content: messageContent,
      });

      if (error) throw error;
    } catch (error: any) {
      setNewMessage(messageContent);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    }
  };

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return `Ontem ${format(date, "HH:mm")}`;
    } else {
      return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
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
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser.avatar_url || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(otherUser.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-base font-bold">{otherUser.full_name}</h1>
              {otherUser.course && (
                <p className="text-xs text-muted-foreground">{otherUser.course}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden bg-muted/20">
        <div className="container mx-auto max-w-4xl h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 text-muted-foreground">
                <MessageSquare className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg font-medium">Nenhuma mensagem ainda</p>
                <p className="text-sm">Inicie a conversa!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwn = message.sender_id === currentUser.id;
                const showAvatar = 
                  index === 0 || 
                  messages[index - 1].sender_id !== message.sender_id;
                
                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 items-end ${isOwn ? "flex-row-reverse" : ""}`}
                  >
                    {showAvatar ? (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage 
                          src={isOwn ? currentUser.user_metadata?.avatar_url : otherUser.avatar_url} 
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(isOwn ? currentUser.user_metadata?.full_name || "Você" : otherUser.full_name)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-8" />
                    )}
                    
                    <div
                      className={`flex flex-col max-w-[70%] ${
                        isOwn ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-card rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(new Date(message.created_at))}
                        </span>
                        {isOwn && (
                          message.read ? (
                            <CheckCheck className="w-3 h-3 text-primary" />
                          ) : (
                            <Check className="w-3 h-3 text-muted-foreground" />
                          )
                        )}
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
            className="p-4 border-t border-border bg-background/95 backdrop-blur"
          >
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 rounded-full"
                autoComplete="off"
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim()}
                size="icon"
                className="rounded-full"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
