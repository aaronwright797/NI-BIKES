# NI Bikes

Northern Ireland's motorcycle marketplace. Buy and sell road, race, motocross, enduro and trials bikes from trusted dealers and private sellers.

Built with [Next.js](https://nextjs.org) (App Router). Step 2 of the build adds [Supabase](https://supabase.com) for auth, the database and photo storage — see `NI-Bikes-MVP-Setup-Guide.md` for the schema.

## Getting started

```bash
npm install
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
- Seed data (12 bikes, 6 dealers) lives in `lib/data.js` and is currently hardcoded — no database yet.

## Deploying

Push this branch, then import the repo into [Vercel](https://vercel.com/new) (connect your GitHub account, no other config needed — it auto-detects Next.js). Vercel then redeploys automatically on every push.

## Next up (Step 2)

Wire up Supabase: run the schema in `NI-Bikes-MVP-Setup-Guide.md`, add auth, replace `lib/data.js`'s hardcoded seed data with real reads/writes, and add photo upload to Supabase Storage.
