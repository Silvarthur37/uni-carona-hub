-- Adicionar campos de endereço residencial na tabela profiles
ALTER TABLE public.profiles
ADD COLUMN home_address text,
ADD COLUMN home_lat numeric,
ADD COLUMN home_lng numeric;

COMMENT ON COLUMN public.profiles.home_address IS 'Endereço residencial completo do usuário';
COMMENT ON COLUMN public.profiles.home_lat IS 'Latitude do endereço residencial';
COMMENT ON COLUMN public.profiles.home_lng IS 'Longitude do endereço residencial';

-- Criar função para calcular distância entre dois pontos (fórmula de Haversine)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 numeric,
  lng1 numeric,
  lat2 numeric,
  lng2 numeric
)
RETURNS numeric
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  earth_radius numeric := 6371; -- Raio da Terra em km
  dlat numeric;
  dlng numeric;
  a numeric;
  c numeric;
BEGIN
  -- Converter graus para radianos
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);
  
  -- Fórmula de Haversine
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlng/2) * sin(dlng/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN earth_radius * c;
END;
$$;

-- Criar função para buscar motoristas próximos ao destino
CREATE OR REPLACE FUNCTION public.get_nearby_drivers(
  destination_lat numeric,
  destination_lng numeric,
  max_distance_km numeric DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  course text,
  university text,
  home_address text,
  distance_km numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.course,
    p.university,
    p.home_address,
    public.calculate_distance(p.home_lat, p.home_lng, destination_lat, destination_lng) as distance_km
  FROM public.profiles p
  WHERE 
    p.home_lat IS NOT NULL 
    AND p.home_lng IS NOT NULL
    AND public.calculate_distance(p.home_lat, p.home_lng, destination_lat, destination_lng) <= max_distance_km
  ORDER BY distance_km ASC;
$$;

-- Conceder permissão de execução para usuários autenticados
GRANT EXECUTE ON FUNCTION public.calculate_distance(numeric, numeric, numeric, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_nearby_drivers(numeric, numeric, numeric) TO authenticated;

-- Dropar e recriar a função get_safe_profile para incluir endereço residencial
DROP FUNCTION IF EXISTS public.get_safe_profile(uuid);

CREATE FUNCTION public.get_safe_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  course text,
  university text,
  hobbies text[],
  home_address text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    full_name,
    avatar_url,
    course,
    university,
    hobbies,
    home_address,
    created_at,
    updated_at
  FROM public.profiles
  WHERE id = profile_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_safe_profile(uuid) TO authenticated;