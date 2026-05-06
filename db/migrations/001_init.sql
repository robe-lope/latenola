-- ============================================================
-- LateNola — Migración inicial
-- ============================================================

-- Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  whatsapp text,
  avatar_emoji text default '⚽',
  created_at timestamptz default now(),
  is_public boolean default true
);

-- Editions (catálogos de álbumes)
create table if not exists editions (
  id text primary key,
  name text not null,
  total_stickers int not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Stickers (catálogo)
create table if not exists stickers (
  id text primary key,
  edition_id text not null references editions(id),
  team_code text not null,
  team_name text not null,
  team_flag text,
  team_group text,
  order_in_team int not null,
  global_number int not null,
  name text not null,
  type text not null,
  is_special boolean default false,
  image_url text,
  unique(edition_id, team_code, order_in_team)
);

create index if not exists stickers_edition_team on stickers (edition_id, team_code);

-- User stickers (lo que tiene cada usuario)
create table if not exists user_stickers (
  user_id uuid not null references profiles(id) on delete cascade,
  sticker_id text not null references stickers(id),
  count int not null default 0,
  updated_at timestamptz default now(),
  primary key (user_id, sticker_id)
);

create index if not exists user_stickers_user on user_stickers (user_id);
create index if not exists user_stickers_sticker_dupes on user_stickers (sticker_id) where count >= 2;

-- ============================================================
-- RLS
-- ============================================================

alter table profiles enable row level security;
alter table editions enable row level security;
alter table stickers enable row level security;
alter table user_stickers enable row level security;

-- Profiles: lectura pública si is_public=true, escritura solo del dueño
create policy "profiles_read_public" on profiles
  for select using (is_public = true or auth.uid() = id);

create policy "profiles_write_own" on profiles
  for all using (auth.uid() = id);

-- Editions y stickers: lectura pública
create policy "editions_read" on editions
  for select using (true);

create policy "stickers_read" on stickers
  for select using (true);

-- User stickers: lectura si el perfil es público o es el propio, escritura solo del dueño
create policy "user_stickers_read" on user_stickers
  for select using (
    user_id = auth.uid() or
    exists (
      select 1 from profiles p
      where p.id = user_stickers.user_id and p.is_public = true
    )
  );

create policy "user_stickers_write_own" on user_stickers
  for all using (auth.uid() = user_id);

-- ============================================================
-- Trigger: crear perfil automáticamente al registrarse
-- ============================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, username, display_name)
  values (
    new.id,
    -- username inicial = parte del email antes del @
    lower(split_part(new.email, '@', 1)),
    split_part(new.email, '@', 1)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
