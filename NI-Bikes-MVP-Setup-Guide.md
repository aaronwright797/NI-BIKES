# NI Bikes — MVP Setup Guide

This is the blueprint for turning the prototype into a real, working site: real accounts, a real
database, listings that persist. Hand this whole file to Claude Code and it can start building
straight away.

**Stack:** Next.js (the app) + Supabase (Postgres database, authentication, and file storage —
one service, one free tier, no separate backend to stand up).

---

## 1. Accounts you need to create yourself

I can't sign these up on your behalf — this is the one bit that's on you, and it takes about
15 minutes total:

1. **GitHub** — free, at github.com. This is where the code lives.
2. **Supabase** — free, at supabase.com. Sign up, then "New project." Pick a name (`ni-bikes`),
   a database password (save it somewhere), and a region close to the UK (usually "West EU").
3. **Vercel** — free, at vercel.com. Sign up with your GitHub account — this is what makes the
   site live on the internet, and it auto-deploys every time the code changes.
4. **A domain** (optional, can wait) — something like nibikes.co.uk, from any registrar
   (Namecheap, GoDaddy, 123-reg). Roughly £10–15/year.

Once you've got a Supabase project created, there are two values in
**Project Settings → API** you'll need to hand to Claude Code: the **Project URL** and the
**anon public key**. Treat these like a username, not a password — they're safe to put in code,
but don't share the separate "service role" key with anyone.

---

## 2. Database schema

This is the shape of the data — four tables. Claude Code can run this directly against your
Supabase project (Supabase has a SQL editor built in, or this can run via their CLI).

```sql
-- Users get an account row automatically via Supabase Auth.
-- This table extends that with the extra profile info NI Bikes needs.
create table profiles (
  id uuid references auth.users(id) primary key,
  account_type text not null check (account_type in ('private', 'dealer')) default 'private',
  display_name text not null,          -- "Private seller" name, or dealership name
  town text,
  phone text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  make text not null,
  category text not null check (category in ('road','race','motocross','enduro','trials')),
  style_tags text[] not null default '{}',
  price integer not null,
  year integer not null,
  mileage integer not null default 0,
  location text not null,
  engine text,
  transmission text,
  owners integer default 1,
  mot text,
  registration text,
  description text,
  status text not null check (status in ('active','sold','draft')) default 'active',
  created_at timestamptz not null default now()
);

create table listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  storage_path text not null,          -- path in Supabase Storage, not a raw URL
  sort_order integer not null default 0
);

create table saved_listings (
  user_id uuid not null references profiles(id) on delete cascade,
  listing_id uuid not null references listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);
```

A few deliberate choices worth knowing about:
- **`verified` lives on the seller, not self-reported per listing** — same principle as the
  prototype: nobody can tick their own "verified" box.
- **Photos are a separate table**, not one field, so a listing can carry several images from
  day one.
- **`status`** lets a seller mark something sold without deleting it — useful later for "sold
  bikes" stats, and standard for this kind of marketplace.

Row-level security (Supabase's way of enforcing "you can only edit your own listings") needs
switching on too — Claude Code should set up policies so:
- anyone can *read* active listings,
- only the owning seller can *edit or delete* their own listing,
- only a logged-in user can *insert* a new one.

---

## 3. Build order

Point Claude Code at this file and this order:

1. `npx create-next-app` — scaffold the project, wire up the Supabase client library.
2. Port the existing homepage/listing UI in as real Next.js pages/components — this is mostly
   copy-and-adapt from the prototype, not a redesign.
3. Deploy to Vercel immediately, even with fake data still in place. You get a real URL on day one.
4. Wire up Supabase Auth (email + password, or magic link) — sign up, log in, log out.
5. Replace the in-memory `listings` array with real reads/writes against the `listings` table.
6. Add photo upload to Supabase Storage, replacing the "photo URL" field.
7. Point the real domain at the Vercel deployment.

---

## 4. What's deliberately not in this phase

Payments, real HPI/DVLA verification, and in-app messaging are Tier 3 — they involve outside
paid services and legal/compliance considerations (GDPR, payment handling) worth doing properly
rather than bolting on early. Worth revisiting once real dealers are actually using the MVP.
