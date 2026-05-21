create extension if not exists pgcrypto;

create table if not exists public.suite_events (
  id uuid primary key default gen_random_uuid(),
  app text not null,
  event_type text not null,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.demo_runs (
  id uuid primary key default gen_random_uuid(),
  app text not null,
  scenario text not null,
  status text not null default 'RECORDED',
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.eval_runs (
  id uuid primary key default gen_random_uuid(),
  app text not null,
  score integer not null check (score >= 0 and score <= 100),
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.exported_reports (
  id uuid primary key default gen_random_uuid(),
  app text not null,
  report_type text not null,
  title text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
