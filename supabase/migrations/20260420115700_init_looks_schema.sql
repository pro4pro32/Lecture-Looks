-- LectureLooks initial schema: users, looks, items, categories, tags.
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.looks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  description text,
  image_url text not null,
  total_price numeric(10, 2) not null default 0 check (total_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.look_items (
  id uuid primary key default gen_random_uuid(),
  look_id uuid not null references public.looks (id) on delete cascade,
  name text not null,
  brand text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  affiliate_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.look_categories (
  look_id uuid not null references public.looks (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (look_id, category_id)
);

create table if not exists public.look_tags (
  look_id uuid not null references public.looks (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (look_id, tag_id)
);

create index if not exists idx_looks_user_id on public.looks (user_id);
create index if not exists idx_look_items_look_id on public.look_items (look_id);
create index if not exists idx_look_categories_category_id on public.look_categories (category_id);
create index if not exists idx_look_tags_tag_id on public.look_tags (tag_id);

alter table public.users enable row level security;
alter table public.looks enable row level security;
alter table public.look_items enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.look_categories enable row level security;
alter table public.look_tags enable row level security;

-- users policies
create policy "users can read all profiles"
  on public.users for select
  using (true);

create policy "users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

create policy "users can update own profile"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- looks policies
create policy "looks are publicly readable"
  on public.looks for select
  using (true);

create policy "authenticated users can create own looks"
  on public.looks for insert
  with check (auth.uid() = user_id);

create policy "users can update own looks"
  on public.looks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users can delete own looks"
  on public.looks for delete
  using (auth.uid() = user_id);

-- look_items policies
create policy "look items are publicly readable"
  on public.look_items for select
  using (true);

create policy "users can insert items to own looks"
  on public.look_items for insert
  with check (
    exists (
      select 1
      from public.looks l
      where l.id = look_id
        and l.user_id = auth.uid()
    )
  );

create policy "users can update items in own looks"
  on public.look_items for update
  using (
    exists (
      select 1
      from public.looks l
      where l.id = look_id
        and l.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.looks l
      where l.id = look_id
        and l.user_id = auth.uid()
    )
  );

create policy "users can delete items in own looks"
  on public.look_items for delete
  using (
    exists (
      select 1
      from public.looks l
      where l.id = look_id
        and l.user_id = auth.uid()
    )
  );

-- categories and tags policies
create policy "categories are publicly readable"
  on public.categories for select
  using (true);

create policy "authenticated users can insert categories"
  on public.categories for insert
  to authenticated
  with check (true);

create policy "authenticated users can update categories"
  on public.categories for update
  to authenticated
  using (true)
  with check (true);

create policy "tags are publicly readable"
  on public.tags for select
  using (true);

create policy "authenticated users can insert tags"
  on public.tags for insert
  to authenticated
  with check (true);

create policy "authenticated users can update tags"
  on public.tags for update
  to authenticated
  using (true)
  with check (true);

-- look_categories policies
create policy "look categories are publicly readable"
  on public.look_categories for select
  using (true);

create policy "users can add categories to own looks"
  on public.look_categories for insert
  with check (
    exists (
      select 1
      from public.looks l
      where l.id = look_id
        and l.user_id = auth.uid()
    )
  );

create policy "users can remove categories from own looks"
  on public.look_categories for delete
  using (
    exists (
      select 1
      from public.looks l
      where l.id = look_id
        and l.user_id = auth.uid()
    )
  );

-- look_tags policies
create policy "look tags are publicly readable"
  on public.look_tags for select
  using (true);

create policy "users can add tags to own looks"
  on public.look_tags for insert
  with check (
    exists (
      select 1
      from public.looks l
      where l.id = look_id
        and l.user_id = auth.uid()
    )
  );

create policy "users can remove tags from own looks"
  on public.look_tags for delete
  using (
    exists (
      select 1
      from public.looks l
      where l.id = look_id
        and l.user_id = auth.uid()
    )
  );
