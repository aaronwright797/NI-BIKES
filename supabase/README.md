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

**Status: all three have been applied to the real Supabase project** (pasted into the SQL
editor and confirmed working). Listings are still unseeded — every listing needs a real
`seller_id` (a row in `auth.users`), which needs real accounts, which needs auth wired up
first (see below).

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
