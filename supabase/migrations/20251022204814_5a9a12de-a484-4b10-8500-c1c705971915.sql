-- Criar tabela de notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ride_id UUID REFERENCES public.rides(id) ON DELETE CASCADE,
  passenger_id UUID,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para notificações
CREATE POLICY "Usuários podem ver suas próprias notificações"
ON public.notifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Sistema pode criar notificações"
ON public.notifications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas notificações"
ON public.notifications
FOR UPDATE
USING (auth.uid() = user_id);

-- Criar índice para melhor performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Função para criar notificação quando alguém solicita carona
CREATE OR REPLACE FUNCTION public.notify_driver_on_ride_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  driver_id UUID;
  passenger_name TEXT;
BEGIN
  -- Buscar o motorista da carona
  SELECT r.driver_id INTO driver_id
  FROM rides r
  WHERE r.id = NEW.ride_id;
  
  -- Buscar nome do passageiro
  SELECT p.full_name INTO passenger_name
  FROM profiles p
  WHERE p.id = NEW.passenger_id;
  
  -- Criar notificação para o motorista
  INSERT INTO notifications (user_id, ride_id, passenger_id, type, message)
  VALUES (
    driver_id,
    NEW.ride_id,
    NEW.passenger_id,
    'ride_request',
    passenger_name || ' solicitou participar da sua carona'
  );
  
  RETURN NEW;
END;
$$;

-- Trigger para criar notificação automaticamente
CREATE TRIGGER on_ride_request_created
  AFTER INSERT ON public.ride_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_driver_on_ride_request();

-- Função para notificar passageiro quando solicitação é aceita/recusada
CREATE OR REPLACE FUNCTION public.notify_passenger_on_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ride_info TEXT;
BEGIN
  -- Apenas notificar se o status mudou
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Buscar informações da carona
    SELECT origin || ' → ' || destination INTO ride_info
    FROM rides
    WHERE id = NEW.ride_id;
    
    -- Criar notificação apropriada
    IF NEW.status = 'confirmado' THEN
      INSERT INTO notifications (user_id, ride_id, type, message)
      VALUES (
        NEW.passenger_id,
        NEW.ride_id,
        'ride_accepted',
        'Sua solicitação para ' || ride_info || ' foi aceita!'
      );
    ELSIF NEW.status = 'recusado' THEN
      INSERT INTO notifications (user_id, ride_id, type, message)
      VALUES (
        NEW.passenger_id,
        NEW.ride_id,
        'ride_rejected',
        'Sua solicitação para ' || ride_info || ' foi recusada'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para notificar passageiro
CREATE TRIGGER on_ride_participant_status_change
  AFTER UPDATE ON public.ride_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_passenger_on_status_change();