-- Criar tabela de mensagens privadas entre usuários
CREATE TABLE public.private_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES public.rides(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies para private_messages
CREATE POLICY "Usuários podem ver mensagens que enviaram ou receberam"
  ON public.private_messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Usuários podem enviar mensagens privadas"
  ON public.private_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Usuários podem atualizar status de leitura das mensagens recebidas"
  ON public.private_messages FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Enable realtime for private_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;

-- Criar índices para melhor performance
CREATE INDEX idx_private_messages_sender ON public.private_messages(sender_id);
CREATE INDEX idx_private_messages_receiver ON public.private_messages(receiver_id);
CREATE INDEX idx_private_messages_ride ON public.private_messages(ride_id);