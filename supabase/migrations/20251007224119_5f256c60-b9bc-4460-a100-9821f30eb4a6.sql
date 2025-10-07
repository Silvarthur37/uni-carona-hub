-- CRITICAL FIX: Drop the overly permissive policy that was just created
DROP POLICY IF EXISTS "Public profiles são visíveis por todos usuários autenticados" ON public.profiles;

-- The correct approach is to keep the existing restrictive policies
-- and use the public_profiles view for safely querying other users' data
-- 
-- Current safe setup:
-- 1. "Usuários podem ver seu próprio perfil completo" - users can see their OWN profile (all columns)
-- 2. "Usuários podem ver informações básicas de outros" - users can see OTHER profiles (all columns, but app should limit)
-- 3. public_profiles view - excludes phone for safer queries
--
-- Note: RLS controls row access, not column access. Applications MUST explicitly
-- select only safe columns when querying profiles of other users to prevent phone harvesting.