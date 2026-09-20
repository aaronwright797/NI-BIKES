# NI Bikes — database schema

Migrations for the Supabase/Postgres schema, written by hand (no Supabase CLI project is
initialized here).

## Files

1. `migrations/20260919120000_initial_schema.sql` — tables, constraints, indexes, and
   the `categories` reference data.
2. `migrations/20260919120100_row_level_security.sql` — enables RLS and defines every
   read/write policy.
3. `migrations/20260919120200_seed_dealers.sql` — seeds the 6 real dealers from
   `lib/data.js`'s `DEALER_META`.
4. `migrations/20260920090000_backfill_missing_profiles.sql` — one-time, idempotent
   catch-up that creates a `profiles` row for any existing `auth.users` row that doesn't
   already have one. Doesn't duplicate or replace `handle_new_user()` (the trigger from
   migration 1, which already auto-creates a profile on every new signup) — this only
   covers accounts that could exist without one already (e.g. predating that trigger, or
   added directly via the Supabase dashboard). Safe to run more than once.
5. `migrations/20260920093000_seed_demo_listings.sql` — seeds the 12 demo bikes from
   `lib/data.js`'s `SEED_LISTINGS` into `listings`. `seller_id` is the one real account in
   `profiles` (looked up by `display_name = 'Aaron Wright'`; the migration raises a clear
   error and inserts nothing if that account isn't found, rather than failing on a bare
   `NOT NULL` violation). `dealer_id` is still resolved independently per listing by dealer
   slug, matching each bike's original private/dealer attribution — who owns the row and
   which dealer it's attributed to are separate. Every insert uses
   `on conflict (slug) do nothing`, so running it more than once can't create duplicates.
   Photos aren't seeded (see the file's own header comment for why).

**Status: migrations 1–4 have been applied to the real Supabase project** (pasted into the
SQL editor and confirmed working — `profiles` now has a real `Aaron Wright` row). **Migration
5 has not been applied yet** — paste it into the SQL editor the same way.

## How to apply

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

## Authentication (email + password)

`utils/supabase/{client,server,middleware}.js`, `proxy.js`, and the `/login`, `/signup`,
`/auth/confirm` routes implement email/password sign-up, log-in, and log-out, with the
header showing "Log in / Sign up" or the signed-in user's name accordingly.

**One manual step in the Supabase dashboard is needed for signup confirmation emails to
actually log the user in**, and it can't be done from this repo — Supabase's default
"Confirm signup" email template points at a hosted verification URL, but this app's
`/auth/confirm` route handler expects the newer `token_hash`/`type` link format. In
**Authentication → Email Templates → Confirm signup**, change the link to:

```
{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/
```

Alternatively, if you'd rather skip email confirmation entirely for now (faster to test,
no template change needed), turn off **Confirm email** under **Authentication → Providers
→ Email** — signups will then get an active session immediately.

**Not yet verified against the real project.** This sandbox's network egress policy blocks
all requests to `supabase.co` outright (confirmed via direct `curl`/`fetch` — a hard 403
"host not in allowlist", not a code error), so the actual sign-up/log-in round trip has
only been verified by code review and local rendering, not by exercising it against your
live database. Please test it yourself (locally with `npm run dev`, or on the deployed
site) and let me know if anything doesn't work as expected.
