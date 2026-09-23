-- NI Bikes — Supabase Storage bucket + policies for listing photos.
--
-- listing_photos.storage_path (see 20260919120000_initial_schema.sql)
-- has always been designed to hold a Storage object path rather than a
-- raw URL; no bucket existed for it yet, so this creates one.
--
-- Bucket is public-read (marketplace photos are meant to be visible to
-- anyone), with a server-side size/type limit as defense-in-depth
-- behind the app's own client-side checks. `on conflict do nothing`
-- makes this safe to run more than once.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-photos',
  'listing-photos',
  true,
  8388608, -- 8MB per file
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- storage.objects is owned by the supabase_storage_admin role, not the
-- role this migration runs as, so it can't be altered here — but
-- Supabase enables RLS on it by default when a project is provisioned,
-- and policies can still be created on it without owning the table, so
-- no `alter table ... enable row level security` is needed or possible.
--
-- Ownership is proven by path, not the `owner` column: every upload is
-- written to `<uploader's auth.uid()>/<listing id>/<file>`, so an
-- object's first path segment is who's allowed to write/delete it.
-- This only proves who uploaded a file — it doesn't by itself prove
-- they own the *listing* it gets attached to. That's enforced
-- separately by listing_photos' own RLS policies (a seller can only
-- insert a listing_photos row for a listing where
-- listings.seller_id = auth.uid() — see
-- 20260919120100_row_level_security.sql), so a file can never actually
-- be attached to someone else's listing even though this bucket is
-- otherwise writable under any listing id in the uploader's own folder.
create policy "listing photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "users can upload their own listing photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "users can delete their own listing photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
