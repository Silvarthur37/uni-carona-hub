-- Criar enum para tipos de badges
CREATE TYPE badge_type AS ENUM ('pontual', 'eco_rider', 'mestre_caronas', 'social', 'musical');

-- Criar enum para status de carona
CREATE TYPE ride_status AS ENUM ('pendente', 'confirmada', 'em_andamento', 'concluida', 'cancelada');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  course TEXT,
  university TEXT,
  hobbies TEXT[],
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de caronas
CREATE TABLE public.rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  origin_lat DECIMAL(10, 8),
  origin_lng DECIMAL(11, 8),
  destination_lat DECIMAL(10, 8),
  destination_lng DECIMAL(11, 8),
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  available_seats INTEGER NOT NULL CHECK (available_seats > 0),
  price DECIMAL(10, 2),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_days INTEGER[], -- 0=domingo, 1=segunda, etc
  description TEXT,
  status ride_status DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de participantes de caronas
CREATE TABLE public.ride_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'recusado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_id, passenger_id)
);

-- Tabela de mensagens de chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES public.rides(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reviewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_id, reviewer_id, reviewed_id)
);

-- Tabela de pontos dos usuários
CREATE TABLE public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  total_rides_as_driver INTEGER DEFAULT 0,
  total_rides_as_passenger INTEGER DEFAULT 0,
  co2_saved_kg DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de badges disponíveis
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT,
  type badge_type NOT NULL,
  points_required INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de badges conquistados pelos usuários
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies para profiles
CREATE POLICY "Perfis são visíveis por todos"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies para rides
CREATE POLICY "Caronas são visíveis por todos"
  ON public.rides FOR SELECT
  USING (true);

CREATE POLICY "Motoristas podem criar caronas"
  ON public.rides FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Motoristas podem atualizar suas caronas"
  ON public.rides FOR UPDATE
  USING (auth.uid() = driver_id);

CREATE POLICY "Motoristas podem deletar suas caronas"
  ON public.rides FOR DELETE
  USING (auth.uid() = driver_id);

-- RLS Policies para ride_participants
CREATE POLICY "Participantes são visíveis para motorista e passageiros"
  ON public.ride_participants FOR SELECT
  USING (
    auth.uid() IN (
      SELECT driver_id FROM public.rides WHERE id = ride_id
      UNION
      SELECT passenger_id FROM public.ride_participants WHERE ride_id = ride_id
    )
  );

CREATE POLICY "Passageiros podem se inscrever em caronas"
  ON public.ride_participants FOR INSERT
  WITH CHECK (auth.uid() = passenger_id);

CREATE POLICY "Motoristas podem atualizar status de participantes"
  ON public.ride_participants FOR UPDATE
  USING (
    auth.uid() IN (SELECT driver_id FROM public.rides WHERE id = ride_id)
  );

-- RLS Policies para messages
CREATE POLICY "Mensagens são visíveis para participantes da carona"
  ON public.messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT driver_id FROM public.rides WHERE id = ride_id
      UNION
      SELECT passenger_id FROM public.ride_participants WHERE ride_id = ride_id
    )
  );

CREATE POLICY "Participantes podem enviar mensagens"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT driver_id FROM public.rides WHERE id = ride_id
      UNION
      SELECT passenger_id FROM public.ride_participants WHERE ride_id = ride_id
    )
  );

-- RLS Policies para reviews
CREATE POLICY "Avaliações são visíveis por todos"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Participantes podem avaliar após a carona"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    auth.uid() IN (
      SELECT driver_id FROM public.rides WHERE id = ride_id
      UNION
      SELECT passenger_id FROM public.ride_participants WHERE ride_id = ride_id
    )
  );

-- RLS Policies para user_points
CREATE POLICY "Pontos são visíveis por todos"
  ON public.user_points FOR SELECT
  USING (true);

CREATE POLICY "Sistema pode atualizar pontos"
  ON public.user_points FOR ALL
  USING (true);

-- RLS Policies para badges
CREATE POLICY "Badges são visíveis por todos"
  ON public.badges FOR SELECT
  USING (true);

-- RLS Policies para user_badges
CREATE POLICY "Badges conquistados são visíveis por todos"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Sistema pode atribuir badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rides_updated_at
  BEFORE UPDATE ON public.rides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'));
  
  INSERT INTO public.user_points (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir badges iniciais
INSERT INTO public.badges (name, description, icon, type, points_required) VALUES
  ('Pontual', 'Sempre chega no horário', '⏰', 'pontual', 100),
  ('Eco Rider', 'Comprometido com o meio ambiente', '🌱', 'eco_rider', 200),
  ('Mestre das Caronas', 'Veterano em compartilhar caronas', '🏆', 'mestre_caronas', 500),
  ('Social', 'Faz amizades em todas as viagens', '👥', 'social', 150),
  ('Musical', 'Cria as melhores playlists', '🎵', 'musical', 100);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;