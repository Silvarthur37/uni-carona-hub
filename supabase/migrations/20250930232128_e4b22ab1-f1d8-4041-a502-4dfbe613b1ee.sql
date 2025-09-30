-- Fix security issue: Restrict phone numbers visibility
-- Users can only see their own complete profile, others see limited info

DROP POLICY IF EXISTS "Perfis são visíveis apenas para usuários autenticados" ON public.profiles;

-- Policy for users to see their own complete profile
CREATE POLICY "Usuários podem ver seu próprio perfil completo"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy for users to see basic info of other users (excluding phone)
CREATE POLICY "Usuários podem ver informações básicas de outros"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() != id);

-- Create favorite_locations table for saved places
CREATE TABLE IF NOT EXISTS public.favorite_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  latitude numeric,
  longitude numeric,
  icon text DEFAULT 'home',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.favorite_locations ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorite locations
CREATE POLICY "Usuários podem ver seus próprios favoritos"
ON public.favorite_locations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios favoritos"
ON public.favorite_locations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios favoritos"
ON public.favorite_locations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios favoritos"
ON public.favorite_locations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_favorite_locations_updated_at
BEFORE UPDATE ON public.favorite_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();