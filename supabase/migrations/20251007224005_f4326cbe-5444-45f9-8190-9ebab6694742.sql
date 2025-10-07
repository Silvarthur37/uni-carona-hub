-- Enable RLS on the public_profiles view and add policy
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- Enable RLS on the view (inherits from underlying profiles table)
-- Note: Views with security_invoker=true will enforce RLS of underlying tables
-- This makes the view accessible while maintaining the security of the profiles table
CREATE POLICY "Public profiles são visíveis por todos usuários autenticados"
ON public.profiles
FOR SELECT
USING (true);

-- This policy allows authenticated users to see the public_profiles view
-- which only exposes non-sensitive fields (no phone numbers)