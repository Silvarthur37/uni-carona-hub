-- Drop and recreate the view with explicit security settings
DROP VIEW IF EXISTS public.public_profiles;

-- Create the view as SECURITY INVOKER (default for views, but being explicit)
-- This means the view runs with the permissions of the user querying it, not the creator
CREATE VIEW public.public_profiles 
WITH (security_invoker=true) AS
SELECT 
  id,
  full_name,
  avatar_url,
  course,
  university,
  hobbies,
  created_at,
  updated_at
FROM public.profiles;

-- Grant SELECT permission on the view to authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- Add comment explaining the security purpose
COMMENT ON VIEW public.public_profiles IS 'Public view of profiles that excludes sensitive data like phone numbers. Use this view when displaying other users profiles to prevent phone number harvesting. View uses SECURITY INVOKER for proper RLS enforcement.';