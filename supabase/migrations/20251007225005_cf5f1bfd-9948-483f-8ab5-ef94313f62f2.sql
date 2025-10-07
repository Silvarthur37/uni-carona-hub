-- Fix: Prevent phone number harvesting by removing overly permissive RLS policy
-- 
-- PROBLEM: The policy "Usuários podem ver informações básicas de outros" allows
-- authenticated users to SELECT from profiles for other users. Since RLS is
-- row-level (not column-level), this gives access to ALL columns including phone.
-- 
-- SOLUTION: Drop this policy. The application code already correctly selects
-- only safe columns (id, full_name, avatar_url, course, university, hobbies).
-- RLS will still allow these queries because PostgreSQL evaluates column-level
-- access separately from row-level security.

-- Drop the problematic policy
DROP POLICY IF EXISTS "Usuários podem ver informações básicas de outros" ON public.profiles;

-- The remaining policy "Usuários podem ver seu próprio perfil completo" still
-- allows users to see their full profile including phone number.
-- 
-- Application code MUST continue to explicitly select only safe columns when
-- querying other users' profiles:
-- .select("id, full_name, avatar_url, course, university, hobbies")