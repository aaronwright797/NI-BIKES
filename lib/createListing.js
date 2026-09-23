import { createClient } from "@/utils/supabase/client";

function slugify(...parts) {
  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function randomSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

// Creates a real `listings` row for the signed-in user via the browser
// Supabase client, so RLS's "sellers can insert their own listings"
// policy (seller_id = auth.uid(), dealer_id null or the seller's own
// linked dealer — see 20260919120100_row_level_security.sql) applies
// exactly as it would for any other client; nothing here runs with
// elevated privileges. No account is linked to a dealer business yet
// (there's no self-serve flow for that), so dealer_id is always null
// regardless of the form's private/dealer toggle — every new listing
// is attributed to the signed-in user's own profile.
export async function createListing(form) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("You need to be signed in to list a bike.");
  }

  const baseSlug = slugify(form.make, form.title.replace(form.make, ""), form.year, form.location) || "bike";

  const payload = {
    seller_id: user.id,
    dealer_id: null,
    title: form.title.trim(),
    make: form.make.trim(),
    category_id: form.category,
    style_tags: form.styleTags,
    price: Number(form.price),
    year: Number(form.year) || new Date().getFullYear(),
    mileage: form.mileage === "" ? 0 : Number(form.mileage) || 0,
    location: form.location,
    engine: form.engine.trim() || null,
    transmission: form.transmission || null,
    owners: Number(form.owners) || 1,
    mot_status: form.mot.trim() || null,
    registration: form.registration.trim() || null,
    description: form.desc.trim() || null,
  };

  // slug must be unique; retry with a short random suffix on collision
  // rather than failing the whole submission over it.
  let slug = baseSlug;
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data, error } = await supabase.from("listings").insert({ ...payload, slug }).select("id").single();
    if (!error) return { id: data.id, slug };
    if (error.code === "23505") {
      slug = `${baseSlug}-${randomSuffix()}`;
      continue;
    }
    throw new Error(error.message);
  }
  throw new Error("Could not create a unique listing URL. Please try again.");
}
