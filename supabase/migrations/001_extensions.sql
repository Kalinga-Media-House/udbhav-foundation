-- Migration: 001_extensions.sql
-- Description: Enables core PostgreSQL extensions required for the UDBHAV Foundation platform.
-- Architecture: Extensions are created in the "extensions" schema (Supabase default) 
--               to prevent cluttering the "public" schema with extension functions and types.

BEGIN;

-- 1. uuid-ossp
-- Required for generating UUIDv4 and UUIDv5 identifiers.
-- While Postgres 13+ has gen_random_uuid() natively, uuid-ossp provides extended 
-- functionality often required by Supabase extensions and legacy migrations.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- 2. pgcrypto
-- Required for cryptographic functions, hashing (e.g., crypt(), gen_salt()), 
-- and handling secure tokens at the database level.
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- 3. citext
-- Provides a case-insensitive character string type.
-- Essential for 'email' and 'username' columns to prevent duplicate registrations 
-- that differ only in casing (e.g., 'User@Example.com' vs 'user@example.com').
CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA extensions;

-- 4. pg_trgm
-- Provides functions and operators for determining the similarity of 
-- alphanumeric text based on trigram matching.
-- Critical for building performant "fuzzy search" over users, events, and content.
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA extensions;

-- 5. unaccent
-- A text search dictionary that removes accents (diacritic signs) from lexemes.
-- Used alongside pg_trgm to ensure searches for "Jose" match "José".
CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA extensions;

COMMIT;
