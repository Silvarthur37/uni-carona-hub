-- Fix: Protect user phone numbers from being harvested
-- Create a view that exposes only public profile information (excludes phone)
CREATE OR REPLACE VIEW public.public_profiles AS
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
COMMENT ON VIEW public.public_profiles IS 'Public view of profiles that excludes sensitive data like phone numbers. Use this view when displaying other users'' profiles to prevent phone number harvesting.';

-- Note: The existing RLS policies on the profiles table remain unchanged.
-- Application code should use public_profiles view for displaying other users,
-- and use profiles table directly only when users access their own profile data.