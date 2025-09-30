-- Fix security issue: Restrict profile visibility to authenticated users only
-- This prevents anonymous users from harvesting personal information

DROP POLICY "Perfis são visíveis por todos" ON public.profiles;

CREATE POLICY "Perfis são visíveis apenas para usuários autenticados"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);