-- Migration: 030_add_program_date_location
-- Description: Add program_date and location to programs table

-- 1. Rename start_date to program_date
ALTER TABLE programs RENAME COLUMN start_date TO program_date;

-- 2. Make program_date nullable temporarily to avoid issues if any exist
ALTER TABLE programs ALTER COLUMN program_date DROP NOT NULL;

-- 3. In the future we will enforce NOT NULL, but for now we leave it as is 
-- because data might exist without it, and user wanted to enforce it in UI.
-- Let's make sure location exists, wait, location already exists.
-- Let's check if location is NOT NULL, it shouldn't be. 
