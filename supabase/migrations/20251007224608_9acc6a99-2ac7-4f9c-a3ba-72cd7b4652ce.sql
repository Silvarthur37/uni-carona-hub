-- Fix: Restrict ride visibility to authenticated users only
-- This prevents anonymous users from tracking location patterns

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Caronas são visíveis por todos" ON public.rides;

-- Create new policy: Only authenticated users can view rides
CREATE POLICY "Caronas são visíveis para usuários autenticados"
ON public.rides
FOR SELECT
TO authenticated
USING (true);

-- Note: GPS coordinates are still visible to authenticated users, but this is necessary
-- for the ride-sharing functionality (distance calculation, map display, route planning).
-- All users are authenticated through the app, which provides accountability.
-- Further restriction of GPS coordinates to only participants would break the search/browse
-- functionality that's core to the ride-sharing experience.