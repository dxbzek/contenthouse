-- Run this in your Supabase SQL editor at:
-- https://supabase.com/dashboard/project/ayowjfeltrnplziriblt/sql/new

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  pillar text not null,
  pillar_id text,
  topic text,
  hook text,
  platform text not null default 'Reel',
  body text,
  scripts jsonb,
  status text default 'idea' check (status in ('idea', 'draft', 'scheduled', 'posted')),
  scheduled_for date,
  created_at timestamptz default now()
);

-- If upgrading an existing table, run this to add the scripts column:
-- alter table content_items add column if not exists scripts jsonb;

-- Disable RLS for single-user local demo
alter table content_items disable row level security;
