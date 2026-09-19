-- NI Bikes — initial database schema
-- Tables: categories, dealers, profiles, listings, listing_photos, saved_listings.
-- This migration only creates structure (+ static category reference data).
-- No auth flows are wired up in the app yet — see supabase/README.md.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- categories — the fixed set of bike types (road/race/motocross/…).
-- Small, stable lookup table so listings.category_id can be a real
-- foreign key instead of a hardcoded check constraint, and so the
-- category tiles/blurbs shown on the homepage are data-driven.
-- ---------------------------------------------------------------
create table categories (
  id text primary key,
  label text not null,
  blurb text,
  sort_order integer not null default 0
);

insert into categories (id, label, blurb, sort_order) values
  ('road', 'Road', 'Tarmac-bred, mile-eating machines', 1),
  ('race', 'Race', 'Track-only, stripped for speed', 2),
  ('motocross', 'Motocross', 'Dirt, jumps, no lights required', 3),
  ('enduro', 'Enduro', 'Street-legal off-road all-rounders', 4),
  ('trials', 'Trials', 'No seat, no fear, all balance', 5);

-- ---------------------------------------------------------------
-- dealers — a dealership's public business profile (address, hours,
-- contact details, rating). Deliberately separate from `profiles`:
-- a dealer is a business, not a person, and may have more than one
-- staff account managing it in future.
-- ---------------------------------------------------------------
create table dealers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  town text,
  address text,
  phone text,
  email text,
  hours text,
  bio text,
  logo_url text,
  rating numeric(2, 1) check (rating >= 0 and rating <= 5),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index dealers_slug_idx on dealers (slug);

-- ---------------------------------------------------------------
-- profiles — one row per Supabase Auth user (1:1 with auth.users).
-- Covers both private sellers and dealer staff accounts;
-- `dealer_id` links a dealer-type account to the business it
-- represents in the `dealers` table above.
-- ---------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  account_type text not null default 'private' check (account_type in ('private', 'dealer')),
  display_name text not null,
  town text,
  phone text,
  dealer_id uuid references dealers (id) on delete set null,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_dealer_id_idx on profiles (dealer_id);

-- ---------------------------------------------------------------
-- listings — the bikes for sale. `dealer_id` is a deliberate
-- denormalization of seller_id -> profiles.dealer_id so "this
-- dealer's current stock" is a single indexed lookup instead of a
-- join, matching how the site already queries it (getDealerStock).
-- The individual `checked_*` trust-check flags mirror the
-- prototype's `checks: { registration, mot, finance, ... }` object.
-- ---------------------------------------------------------------
create table listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  seller_id uuid not null references profiles (id) on delete cascade,
  dealer_id uuid references dealers (id) on delete set null,
  title text not null,
  make text not null,
  category_id text not null references categories (id),
  style_tags text[] not null default '{}',
  price integer not null check (price >= 0),
  year integer not null check (year between 1885 and extract(year from now())::int + 1),
  mileage integer not null default 0 check (mileage >= 0),
  location text not null,
  engine text,
  fuel text not null default 'Petrol',
  transmission text,
  owners integer not null default 1 check (owners >= 1),
  mot_status text,
  registration text,
  description text,
  checked_registration boolean not null default false,
  checked_mot boolean not null default false,
  checked_finance boolean not null default false,
  checked_service_history boolean not null default false,
  checked_hpi boolean not null default false,
  status text not null default 'active' check (status in ('active', 'sold', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index listings_slug_idx on listings (slug);
create index listings_status_idx on listings (status);
create index listings_category_id_idx on listings (category_id);
create index listings_seller_id_idx on listings (seller_id);
create index listings_dealer_id_idx on listings (dealer_id);
create index listings_location_idx on listings (location);
create index listings_created_at_idx on listings (created_at desc);

-- ---------------------------------------------------------------
-- listing_photos — one-to-many photos per listing. `storage_path`
-- points at an object in Supabase Storage, not a raw external URL.
-- `alt_text` supports the "alt text on every listing photo" SEO
-- requirement from the kickoff brief.
-- ---------------------------------------------------------------
create table listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index listing_photos_listing_id_idx on listing_photos (listing_id, sort_order);

-- ---------------------------------------------------------------
-- saved_listings — the heart/save feature, once a user is signed in.
-- ---------------------------------------------------------------
create table saved_listings (
  user_id uuid not null references profiles (id) on delete cascade,
  listing_id uuid not null references listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index saved_listings_listing_id_idx on saved_listings (listing_id);

-- ---------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_dealers_updated_at
  before update on dealers
  for each row execute function set_updated_at();

create trigger set_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

create trigger set_listings_updated_at
  before update on listings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------
-- Auto-create a profile row when someone signs up via Supabase
-- Auth. Inert until the frontend actually wires up auth — no UI
-- changes are made in this migration.
-- ---------------------------------------------------------------
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, account_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'account_type', 'private')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
