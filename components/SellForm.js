"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, STYLE_TAGS, NI_TOWNS } from "@/lib/data";
import { createListing } from "@/lib/createListing";
import { MAX_PHOTOS, validatePhotoFiles, uploadListingPhotos } from "@/lib/uploadListingPhotos";
import { withTimeout } from "@/utils/withTimeout";

export default function SellForm({ initialType }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", make: "", category: "road", price: "", year: new Date().getFullYear(),
    mileage: "", location: "Belfast", engine: "", transmission: "6-speed", owners: 1,
    mot: "", registration: "", desc: "", sellerType: initialType === "dealer" ? "dealer" : "private", sellerName: "",
    styleTags: [],
  });
  const [photos, setPhotos] = useState([]); // File[]
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Set only when the listing published but some photos failed — in
  // that case we stop short of auto-redirecting so the user actually
  // sees the notice, rather than it flashing by as the page navigates.
  const [publishedWithIssue, setPublishedWithIssue] = useState(null); // { slug, notice } | null

  // Object URLs are per-file and only meaningful in this tab — revoke
  // them on unmount/change so they don't leak memory.
  const previewUrls = useMemo(() => photos.map((f) => URL.createObjectURL(f)), [photos]);
  useEffect(() => {
    return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [previewUrls]);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function toggleStyle(tag) {
    setForm((f) => ({
      ...f,
      styleTags: f.styleTags.includes(tag) ? f.styleTags.filter((t) => t !== tag) : [...f.styleTags, tag],
    }));
  }

  function onPhotosSelected(e) {
    const selected = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same file(s) later
    if (selected.length === 0) return;
    const combined = [...photos, ...selected];
    const next = combined.slice(0, MAX_PHOTOS);
    const errors = validatePhotoFiles(next);
    if (combined.length > MAX_PHOTOS) errors.unshift(`Only the first ${MAX_PHOTOS} photos were kept (max ${MAX_PHOTOS}).`);
    setError(errors[0] || "");
    setPhotos(next);
  }

  function removePhoto(index) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.make.trim() || !form.price || !form.location.trim()) {
      setError("Fill in at least a title, make, price and location.");
      return;
    }
    if (form.sellerType === "dealer" && !form.sellerName.trim()) { setError("Add your dealership name so buyers know who they're dealing with."); return; }
    const photoErrors = validatePhotoFiles(photos);
    if (photoErrors.length > 0) { setError(photoErrors[0]); return; }
    setError("");
    setLoading(true);
    try {
      const { id, slug } = await withTimeout(createListing(form));
      // The listing already exists and is valid at this point regardless
      // of what happens next — a photo problem is reported, never
      // allowed to undo or block the listing itself.
      if (photos.length > 0) {
        const { failed } = await withTimeout(uploadListingPhotos(id, photos));
        if (failed > 0) {
          setPublishedWithIssue({
            slug,
            notice: `Listing published, but ${failed} of ${photos.length} photo${photos.length === 1 ? "" : "s"} failed to upload. You can add photos later.`,
          });
          return;
        }
      }
      router.push(`/bikes/${slug}`);
      router.refresh();
    } catch (err) {
      setError(err?.message || "Something went wrong publishing your listing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (publishedWithIssue) {
    return (
      <div className="sheet-form" style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2>Listing published</h2>
        <p className="muted">{publishedWithIssue.notice}</p>
        <div className="sheet-actions">
          <button className="btn btn-amber" onClick={() => router.push(`/bikes/${publishedWithIssue.slug}`)}>View your listing</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sheet-form" style={{ maxWidth: 640, margin: "0 auto" }}>
      <h2>List your bike</h2>
      <p className="muted">A few details get you in front of buyers.</p>
      <div className="seller-toggle" role="group" aria-label="Selling as">
        <button type="button" className={"toggle-btn" + (form.sellerType === "private" ? " toggle-btn-active" : "")} onClick={() => update("sellerType", "private")}>Private seller</button>
        <button type="button" className={"toggle-btn" + (form.sellerType === "dealer" ? " toggle-btn-active" : "")} onClick={() => update("sellerType", "dealer")}>Trade / dealer</button>
      </div>
      <form onSubmit={submit} className="form">
        {form.sellerType === "dealer" && (
          <label>Dealership name<input type="text" placeholder="e.g. Lagan Motorcycles" value={form.sellerName} onChange={(e) => update("sellerName", e.target.value)} /></label>
        )}
        <label>Title<input type="text" placeholder="e.g. Honda CBR600RR" value={form.title} onChange={(e) => update("title", e.target.value)} /></label>
        <div className="form-row">
          <label>Make<input type="text" placeholder="e.g. Honda" value={form.make} onChange={(e) => update("make", e.target.value)} /></label>
          <label>Type<select value={form.category} onChange={(e) => update("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
        </div>
        <div className="form-row">
          <label>Price (£)<input type="number" min="0" placeholder="4500" value={form.price} onChange={(e) => update("price", e.target.value)} /></label>
          <label>Year<input type="number" min="1950" max={new Date().getFullYear() + 1} value={form.year} onChange={(e) => update("year", e.target.value)} /></label>
        </div>
        <div className="form-row">
          <label>Mileage<input type="number" min="0" placeholder="0" value={form.mileage} onChange={(e) => update("mileage", e.target.value)} /></label>
          <label>Location<select value={form.location} onChange={(e) => update("location", e.target.value)}>{NI_TOWNS.map((t) => <option key={t} value={t}>{t}</option>)}</select></label>
        </div>
        <label>Engine / spec<input type="text" placeholder="e.g. 599cc inline-four" value={form.engine} onChange={(e) => update("engine", e.target.value)} /></label>
        <div className="form-row">
          <label>Transmission
            <select value={form.transmission} onChange={(e) => update("transmission", e.target.value)}>
              <option value="6-speed">6-speed</option>
              <option value="5-speed">5-speed</option>
              <option value="4-speed">4-speed</option>
              <option value="Automatic / DCT">Automatic / DCT</option>
              <option value="CVT">CVT</option>
            </select>
          </label>
          <label>Owners<input type="number" min="1" value={form.owners} onChange={(e) => update("owners", e.target.value)} /></label>
        </div>
        <div className="form-row">
          <label>MOT<input type="text" placeholder="e.g. Valid until Apr 2027, or 'Off-road only'" value={form.mot} onChange={(e) => update("mot", e.target.value)} /></label>
          <label>Registration<input type="text" placeholder="e.g. ABC 1234, or 'Not road registered'" value={form.registration} onChange={(e) => update("registration", e.target.value)} /></label>
        </div>
        <label>
          Style <span className="label-optional">(pick any that fit — helps buyers find it)</span>
          <div className="style-check-grid">
            {STYLE_TAGS.map((s) => (
              <button
                type="button"
                key={s}
                className={"style-check" + (form.styleTags.includes(s) ? " style-check-active" : "")}
                onClick={() => toggleStyle(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </label>
        <label>
          Photos <span className="label-optional">(optional — up to {MAX_PHOTOS}, JPEG/PNG/WebP, 8MB each; first photo is the main one)</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={photos.length >= MAX_PHOTOS} onChange={onPhotosSelected} />
        </label>
        {photos.length > 0 && (
          <div className="style-check-grid">
            {photos.map((file, i) => (
              <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
                <img
                  src={previewUrls[i]}
                  alt=""
                  style={{ width: 72, height: 72, objectFit: "cover", border: "1px solid var(--line)", display: "block" }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  aria-label={`Remove ${file.name}`}
                  style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", border: "1px solid var(--line)", background: "var(--panel)", cursor: "pointer" }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <label>Description<textarea rows={4} placeholder="Condition, history, extras included…" value={form.desc} onChange={(e) => update("desc", e.target.value)} /></label>
        {error && <p className="form-error">{error}</p>}
        <p className="muted-sm tier-note">Your listing goes live immediately once published. No payment is processed in this build.</p>
        <div className="sheet-actions">
          <button type="submit" className="btn btn-amber" disabled={loading}>{loading ? "Publishing…" : "Publish listing"}</button>
        </div>
      </form>
    </div>
  );
}
