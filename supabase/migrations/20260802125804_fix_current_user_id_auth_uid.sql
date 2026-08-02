-- Fix public.current_user_id() to use auth.uid() instead of manually parsing JWT claims
-- This ensures compatibility with both older and newer PostgREST versions where claims might be in request.jwt.claims

CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;
