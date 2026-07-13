-- Newsletter subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  unsubscribe_token text not null unique,
  source text not null default 'landing',
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create index if not exists idx_newsletter_subscribers_active
  on public.newsletter_subscribers (subscribed_at desc)
  where status = 'active';

-- Daily newsletter send log (avoids duplicate topics, audit trail)
create table if not exists public.newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content_preview text,
  subscriber_count integer not null default 0,
  sent_at timestamptz not null default now()
);

create index if not exists idx_newsletter_issues_sent_at
  on public.newsletter_issues (sent_at desc);
