# NI Bikes — database schema

Migrations for the Supabase/Postgres schema, written by hand (no Supabase CLI project is
initialized here). **Nothing in this folder has been run against the real Supabase project
yet** — these are for review first.

## Files

1. `migrations/20260919120000_initial_schema.sql` — tables, constraints, indexes, and
   the `categories` reference data.
2. `migrations/20260919120100_row_level_security.sql` — enables RLS and defines every
   read/write policy.
3. `migrations/20260919120200_seed_dealers.sql` — seeds the 6 real dealers from
   `lib/data.js`'s `DEALER_META`. Listings aren't seeded yet — every listing needs a real
   `seller_id` (a row in `auth.users`), so that follows once auth is wired up.

Run them in that order.

## How to apply (once approved)

Either paste each file's contents into the Supabase SQL editor in order, or, if you set up
the Supabase CLI locally and link it to the project (`supabase link`), run:

```bash
supabase db push
```

## Validation

Each file was applied and exercised against a disposable local Postgres database (not the
real Supabase project) with a minimal stand-in for Supabase's `auth` schema/roles — table
creation, the `categories`/`dealers` seed data, the `handle_new_user` trigger, a listing
insert with a photo, and a `year` check-constraint violation were all confirmed to work as
expected before this was handed back for review.
