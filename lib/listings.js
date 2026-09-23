/* ---------------------------------------------------------
   NI Bikes — read-only Supabase queries for listings/dealers.

   Uses the public anon/publishable key directly (no cookies), so
   these run anywhere: Server Components, generateStaticParams,
   and sitemap.js at build time. RLS still fully applies — these
   only ever see what "active listings are publicly readable" and
   "dealers are publicly readable" (see
   supabase/migrations/20260919120100_row_level_security.sql) allow
   an anonymous request to see.
--------------------------------------------------------- */
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const PHOTOS_BUCKET = "listing-photos";

const LISTING_SELECT = `
  id, slug, title, make, category_id, style_tags,
  price, year, mileage, location, engine, fuel, transmission, owners,
  mot_status, registration, description,
  checked_registration, checked_mot, checked_finance, checked_service_history, checked_hpi,
  created_at, dealer_id,
  dealers ( id, slug, name, verified ),
  listing_photos ( storage_path, sort_order )
`;

// listing_photos.storage_path is a Supabase Storage object path, not a
// URL — getPublicUrl() just builds the public URL string locally, no
// network call, so this is safe to do for every row inline.
function photoUrl(storagePath) {
  return supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

// Maps a `listings` row (+ embedded `dealers`/`listing_photos`) onto
// the shape the UI already expects from the old lib/data.js seed data,
// so components built against that shape don't need to change.
function mapListing(row) {
  const dealer = row.dealers;
  const photos = (row.listing_photos || [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => photoUrl(p.storage_path));
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    make: row.make,
    category: row.category_id,
    styleTags: row.style_tags || [],
    price: row.price,
    year: row.year,
    mileage: row.mileage,
    location: row.location,
    engine: row.engine,
    fuel: row.fuel,
    transmission: row.transmission,
    owners: row.owners,
    mot: row.mot_status,
    registration: row.registration,
    desc: row.description,
    sellerType: dealer ? "dealer" : "private",
    sellerName: dealer ? dealer.name : "Private seller",
    verified: dealer ? !!dealer.verified : false,
    checks: {
      registration: row.checked_registration,
      mot: row.checked_mot,
      finance: row.checked_finance,
      serviceHistory: row.checked_service_history,
      hpi: row.checked_hpi,
    },
    // Real uploaded photos, in sort_order. The 13 existing listings
    // have none yet, so PhotoOrArt falls back to category artwork for
    // them exactly as before — this is additive, not a behavior change
    // for any current row.
    photos,
    createdAt: row.created_at,
    dealerSlug: dealer ? dealer.slug : null,
  };
}

export async function getActiveListings() {
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapListing);
}

export async function getActiveListingSlugs() {
  const { data, error } = await supabase.from("listings").select("slug").eq("status", "active");
  if (error) throw error;
  return (data || []).map((l) => l.slug);
}

export async function getListingBySlug(slug) {
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();
  if (error) throw error;
  return data ? mapListing(data) : null;
}

async function getListingsByDealerId(dealerId) {
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("status", "active")
    .eq("dealer_id", dealerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapListing);
}

// Only dealers with at least one active listing, each carrying its
// active-listing count — matches the old getAllDealers(), which was
// derived purely from SEED_LISTINGS and so only ever showed dealers
// that actually had stock.
export async function getDealersWithStock() {
  const { data, error } = await supabase
    .from("listings")
    .select("dealer_id, dealers ( id, slug, name, town, address, phone, email, hours, bio, rating, verified )")
    .eq("status", "active")
    .not("dealer_id", "is", null);
  if (error) throw error;

  const byId = new Map();
  for (const row of data || []) {
    if (!row.dealers) continue;
    const existing = byId.get(row.dealers.id);
    if (existing) existing.count += 1;
    else byId.set(row.dealers.id, { ...row.dealers, count: 1 });
  }
  return [...byId.values()].sort((a, b) => b.count - a.count);
}

export async function getDealerBySlug(slug) {
  const dealers = await getDealersWithStock();
  const dealer = dealers.find((d) => d.slug === slug);
  if (!dealer) return null;
  const stock = await getListingsByDealerId(dealer.id);
  return { ...dealer, stock };
}
