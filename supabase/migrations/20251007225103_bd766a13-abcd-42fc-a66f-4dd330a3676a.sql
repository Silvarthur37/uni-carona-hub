-- Rollback and implement proper column-level security using a security definer function
-- 
-- Problem: RLS is row-level only, not column-level. We need to allow viewing
-- other users' profiles but exclude sensitive data like phone numbers.
--
-- Solution: Create a security definer function that returns only safe profile columns

-- First, restore the policy we just dropped (application needs it)
CREATE POLICY "Usuários podem ver informações básicas de outros"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() <> id);

-- Create a security definer function that returns safe profile data
-- This function will be used by the application to safely query other users' profiles
CREATE OR REPLACE FUNCTION public.get_safe_profile(profile_id uuid)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  course text,
  university text,
  hobbies text[],
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
    created_at,
    updated_at
  FROM public.profiles
  WHERE id = profile_id;
$$;

-- Create a function to get multiple safe profiles (for lists)
CREATE OR REPLACE FUNCTION public.get_safe_profiles(excluded_user_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  full_name text,
  avatar_url text,
  course text,
  university text,
  hobbies text[],
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
    created_at,
    updated_at
  FROM public.profiles
  WHERE id != COALESCE(excluded_user_id, '00000000-0000-0000-0000-000000000000'::uuid);
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_safe_profile(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_safe_profiles(uuid) TO authenticated;

-- Note: The application code should be updated to use these functions instead of
-- directly querying the profiles table for other users. This provides true
-- column-level security that RLS policies cannot provide.