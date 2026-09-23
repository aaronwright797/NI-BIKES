import { createClient } from "@/utils/supabase/client";

const BUCKET = "listing-photos";

export const MAX_PHOTOS = 8;
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB — matches the bucket's own file_size_limit
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

function extensionFor(file) {
  const fromName = file.name?.split(".").pop();
  if (fromName && /^[a-z0-9]+$/i.test(fromName)) return fromName.toLowerCase();
  return file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

// Client-side check ahead of upload, so the user finds out about a bad
// file immediately rather than after a round trip — the bucket's own
// file_size_limit/allowed_mime_types (see
// 20260923100000_listing_photo_storage.sql) enforce the same limits
// server-side regardless.
export function validatePhotoFiles(files) {
  const errors = [];
  if (files.length > MAX_PHOTOS) {
    errors.push(`You can upload up to ${MAX_PHOTOS} photos (${files.length} selected).`);
  }
  for (const file of files) {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      errors.push(`"${file.name}" isn't a supported image type (use JPEG, PNG or WebP).`);
    } else if (file.size > MAX_PHOTO_BYTES) {
      errors.push(`"${file.name}" is too large (max ${(MAX_PHOTO_BYTES / (1024 * 1024)).toFixed(0)}MB).`);
    }
  }
  return errors;
}

// Uploads each photo to Storage and creates its listing_photos row.
// Always called after the listing itself already exists and
// succeeded, so a photo failure here can never undo or block the
// listing — each file succeeds or fails independently (via
// allSettled), and a file that uploaded but couldn't get its DB row
// (e.g. a transient error) has its storage object removed again
// rather than left orphaned with nothing pointing at it.
export async function uploadListingPhotos(listingId, files) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { uploaded: 0, failed: files.length };

  const results = await Promise.allSettled(
    files.map(async (file, index) => {
      const path = `${user.id}/${listingId}/${Date.now()}-${randomId()}.${extensionFor(file)}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;

      const { error: rowError } = await supabase
        .from("listing_photos")
        .insert({ listing_id: listingId, storage_path: path, sort_order: index });
      if (rowError) {
        await supabase.storage.from(BUCKET).remove([path]).catch(() => {});
        throw rowError;
      }
    })
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  return { uploaded: files.length - failed, failed };
}
