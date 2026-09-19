"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, STYLE_TAGS, NI_TOWNS } from "@/lib/data";

export default function SellForm({ initialType }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "", make: "", category: "road", price: "", year: new Date().getFullYear(),
    mileage: "", location: "Belfast", engine: "", transmission: "6-speed", owners: 1,
    mot: "", registration: "", desc: "", sellerType: initialType === "dealer" ? "dealer" : "private", sellerName: "",
    styleTags: [], photoUrl: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  function toggleStyle(tag) {
    setForm((f) => ({
      ...f,
      styleTags: f.styleTags.includes(tag) ? f.styleTags.filter((t) => t !== tag) : [...f.styleTags, tag],
    }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.price || !form.location.trim()) { setError("Fill in at least a title, price and location."); return; }
    if (form.sellerType === "dealer" && !form.sellerName.trim()) { setError("Add your dealership name so buyers know who they're dealing with."); return; }
    setError("");
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="sheet-form" style={{ maxWidth: 640, margin: "0 auto" }}>
        <h2>Listing submitted</h2>
        <p className="muted">Thanks — &ldquo;{form.title}&rdquo; is queued to go live. Once accounts and the database are connected, published listings will appear instantly in search.</p>
        <div className="sheet-actions">
          <button className="btn btn-amber" onClick={() => router.push("/")}>Back to homepage</button>
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
          Photo URL <span className="label-optional">(optional — link to a photo of your bike)</span>
          <input type="url" placeholder="https://…" value={form.photoUrl} onChange={(e) => update("photoUrl", e.target.value)} />
        </label>
        <label>Description<textarea rows={4} placeholder="Condition, history, extras included…" value={form.desc} onChange={(e) => update("desc", e.target.value)} /></label>
        {error && <p className="form-error">{error}</p>}
        <p className="muted-sm tier-note">This build publishes your listing to a confirmation screen only — no payment, and nothing is saved to the database yet.</p>
        <div className="sheet-actions">
          <button type="submit" className="btn btn-amber">Publish listing</button>
        </div>
      </form>
    </div>
  );
}
