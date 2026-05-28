-- Enable UUID generation
create extension if not exists pgcrypto;

-- Companies
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Users <-> Companies mapping
create table if not exists public.company_members (
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (company_id, user_id)
);

-- Main content history
create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  company_id uuid references public.companies(id) on delete set null,
  content text not null,
  analysis text,
  mode text,
  content_score integer,
  readability numeric,
  tone text,
  key_insights jsonb not null default '[]'::jsonb,
  improvements jsonb not null default '[]'::jsonb,
  word_count integer,
  reading_time integer,
  ai_score integer,
  human_score integer,
  humanized_version text,
  outline jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  content_gaps jsonb not null default '[]'::jsonb,
  summary text,
  related_links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_contents_user_created_at on public.contents(user_id, created_at desc);
create index if not exists idx_contents_company_created_at on public.contents(company_id, created_at desc);
create index if not exists idx_companies_domain on public.companies(domain);
