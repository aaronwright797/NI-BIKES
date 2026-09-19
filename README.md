# NI Bikes

Northern Ireland's motorcycle marketplace. Buy and sell road, race, motocross, enduro and trials bikes from trusted dealers and private sellers.

Built with [Next.js](https://nextjs.org) (App Router). Step 2 of the build adds [Supabase](https://supabase.com) for auth, the database and photo storage — see `NI-Bikes-MVP-Setup-Guide.md` for the schema.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + publishable key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's here (Step 1)

- Full homepage discovery layout (hero, Just Landed carousel, category tiles, style chips, valuation tool, dealer preview) ported from the original prototype.
- Real, individually addressable, server-rendered pages:
  - `/bikes/[slug]` — one page per listing, e.g. `/bikes/yamaha-yzf-r6-2018-lisburn`
  - `/dealers/[slug]` — one page per dealer, e.g. `/dealers/lagan-motorcycles`
  - `/dealers` — full dealer directory
  - `/sell` — list-your-bike form (private seller or dealer)
- SEO: unique `<title>`/description per listing and dealer page, Open Graph tags, `schema.org` `Vehicle`/`AutoDealer` structured data, `sitemap.xml`, `robots.txt`.
- Seed data (12 bikes, 6 dealers) lives in `lib/data.js` and is currently hardcoded — no database reads yet.
- Supabase client helpers are wired up (`utils/supabase/{client,server,middleware}.js`, `proxy.js` refreshing the auth session on every request) but nothing in the app calls them yet — listings, dealers and the sell form still run entirely on the seed data in `lib/data.js`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project's URL and publishable key (**Project Settings → API** in the Supabase dashboard):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`.env.local` is gitignored — for the Vercel deployment, add the same two variables under Project Settings → Environment Variables.

## Deploying

Push this branch, then import the repo into [Vercel](https://vercel.com/new) (connect your GitHub account — it auto-detects Next.js). Add the environment variables above in Vercel's project settings. Vercel then redeploys automatically on every push.

## Next up (Step 2)

Run the schema in `NI-Bikes-MVP-Setup-Guide.md` against the Supabase project, add sign-up/log-in/log-out using the `utils/supabase` clients, replace `lib/data.js`'s hardcoded seed data with real reads/writes, and add photo upload to Supabase Storage.
