-- Migration: 20260816184500_news_events_content.sql
-- Description: Unifies Event records into news_articles and supports lightweight events

BEGIN;

-- Add 'Event' to article_type enum
ALTER TYPE public.article_type ADD VALUE IF NOT EXISTS 'Event';

-- Add event-specific columns to news_articles
ALTER TABLE public.news_articles
  ADD COLUMN IF NOT EXISTS event_date date,
  ADD COLUMN IF NOT EXISTS event_start_time time without time zone,
  ADD COLUMN IF NOT EXISTS event_end_time time without time zone,
  ADD COLUMN IF NOT EXISTS event_location text,
  ADD COLUMN IF NOT EXISTS event_address text,
  ADD COLUMN IF NOT EXISTS registration_url text;

-- Add index on event_date for fast classification of upcoming/past events
CREATE INDEX IF NOT EXISTS idx_news_articles_event_date ON public.news_articles(event_date);

COMMIT;