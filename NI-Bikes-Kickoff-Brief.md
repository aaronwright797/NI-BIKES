# NI Bikes — Kickoff Brief for Claude Code

Paste this whole message into Claude Code, along with the two attached files
(`NIBikes.jsx` and `NI-Bikes-MVP-Setup-Guide.md`), to start the real build.

---

## What this is

NI Bikes is a Northern Ireland motorcycle marketplace. `NIBikes.jsx` is a working
single-file React prototype — the full design, brand, copy, and all the interactive
logic (filtering, search, the sell flow, dealer profiles, valuation tool) already
exist and are approved. This is not a redesign job. The task is to rebuild it as a
real, deployed, database-backed web app.

## Stack

Next.js (the app) + Supabase (Postgres database, auth, and file storage — one
service, no separate backend to stand up).

## Step 1 — Scaffold and deploy (do this first, today)

1. Create a new Next.js project.
2. Port the design, layout, copy, and all interactive behaviour from `NIBikes.jsx`
   over as real Next.js components. Keep it faithful to the prototype — same colours,
   same layout, same copy — this step is a rebuild, not a redesign.
3. **Structure listings and dealers as real individual pages, not a single
   scrolling page with popups:**
   - `/bikes/[slug]` — one page per listing (e.g. `/bikes/yamaha-yzf-r6-2018-lisburn`)
   - `/dealers/[slug]` — one page per dealer (e.g. `/dealers/lagan-motorcycles`)
   - The homepage keeps its current discovery layout (hero, Just Landed, category
     tiles, etc.) but its cards link to these real pages instead of opening a modal.
   - This matters for SEO — it's far easier to build this way from the start than
     retrofit it later.
4. Deploy to Vercel immediately, using the existing hardcoded seed data from the
   prototype. Getting a real, live URL today is the priority — the backend comes next.

## Step 2 — Database and auth (once Step 1 is deployed)

Full schema and reasoning are in `NI-Bikes-MVP-Setup-Guide.md`. Summary:

- `profiles` table (extends Supabase Auth users — account_type private/dealer,
  display name, town, verified flag)
- `listings` table (all the fields already in the prototype's data model: title,
  make, category, style_tags, price, year, mileage, location, engine,
  transmission, owners, mot, registration, description, status)
- `listing_photos` table (separate table, so a listing can carry several images)
- `saved_listings` table (for the save/heart feature)
- Row-level security: anyone can read active listings; only the owning seller can
  edit or delete their own; only a logged-in user can create one.

Order of work:
1. Run the schema against the Supabase project (SQL editor).
2. Wire up Supabase Auth — sign up, log in, log out.
3. Replace the hardcoded `listings` array with real reads from the database.
   Start read-only — same 12 seed bikes, just served from Postgres instead of
   sitting in memory.
4. Make the Sell form write a real row instead of updating local state.
5. Photo upload to Supabase Storage, replacing the current photo-URL field.

## On hold for later (don't build yet)

Payments, real HPI/DVLA verification, and in-app messaging. These involve paid
third-party services and compliance considerations worth doing properly once
real dealers are actually using the MVP — not now.

## SEO — build in from the start, not bolted on later

- Unique `<title>` and meta description per bike and dealer page (e.g.
  "2018 Yamaha YZF-R6 for sale in Lisburn — £5,200 | NI Bikes").
- Schema.org structured data on listing pages (Vehicle/Product type — price,
  location, mileage) so Google can show rich results.
- Alt text on every listing photo.
- Server-rendered pages (Next.js does this by default if built correctly —
  don't let listing/dealer pages end up client-side-only).
