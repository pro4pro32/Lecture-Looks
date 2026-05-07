create table if not exists public.saved_looks (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  look_id text not null,
  created_at timestamptz not null default now(),
  unique (device_id, look_id)
);

create table if not exists public.look_submissions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  tags text[] not null default '{}',
  image_name text not null,
  items jsonb not null default '[]'::jsonb,
  moderation_status text not null default 'pending_admin_approve',
  created_at timestamptz not null default now()
);

create index if not exists idx_saved_looks_device_id on public.saved_looks (device_id);
create index if not exists idx_look_submissions_status on public.look_submissions (moderation_status);

alter table public.saved_looks enable row level security;
alter table public.look_submissions enable row level security;

create policy "anon can read saved looks"
  on public.saved_looks for select
  to anon, authenticated
  using (true);

create policy "anon can insert saved looks"
  on public.saved_looks for insert
  to anon, authenticated
  with check (true);

create policy "anon can delete saved looks"
  on public.saved_looks for delete
  to anon, authenticated
  using (true);

create policy "anon can insert look submissions"
  on public.look_submissions for insert
  to anon, authenticated
  with check (true);

create policy "admin can read submissions"
  on public.look_submissions for select
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');
