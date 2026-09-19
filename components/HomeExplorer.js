"use client";

import { useMemo, useRef, useState, Fragment } from "react";
import Link from "next/link";
import {
  CATEGORIES, OFFROAD, SERIOUS, STYLE_TAGS, PRICE_OPTIONS, NI_TOWNS,
  CATEGORY_PHOTOS, HERO_PHOTO, SEED_LISTINGS, categoryMeta, gbp, milesShort, engineShort, getAllDealers,
} from "@/lib/data";
import { BikeMark, HeartIcon, StatIcon } from "./Icons";
import PhotoOrArt from "./PhotoOrArt";

export default function HomeExplorer() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [townFilter, setTownFilter] = useState("");
  const [styleFilter, setStyleFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sellerFilter, setSellerFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [saved, setSaved] = useState(() => new Set());
  const [valuation, setValuation] = useState(null);
  const [valForm, setValForm] = useState({ make: "", model: "", year: new Date().getFullYear(), mileage: "" });
  const carouselRef = useRef(null);

  const listings = SEED_LISTINGS;

  function toggleSaved(id, e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let out = listings.filter((l) => {
      const inCat = category === "all" || (category === "offroad" ? OFFROAD.includes(l.category) : l.category === category);
      const q = query.trim().toLowerCase();
      const inQuery = !q || l.title.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.engine.toLowerCase().includes(q) || l.make.toLowerCase().includes(q);
      const inPrice = !priceMax || l.price <= Number(priceMax);
      const inSeller = sellerFilter === "all" || l.sellerType === sellerFilter;
      const inTown = !townFilter || l.location === townFilter;
      const inVerified = !verifiedOnly || l.verified;
      const inStyle = !styleFilter || (l.styleTags || []).includes(styleFilter);
      return inCat && inQuery && inPrice && inSeller && inTown && inVerified && inStyle;
    });
    if (sort === "price-low") out = [...out].sort((a, b) => a.price - b.price);
    if (sort === "price-high") out = [...out].sort((a, b) => b.price - a.price);
    if (sort === "year") out = [...out].sort((a, b) => b.year - a.year);
    if (sort === "newest") out = [...out].sort((a, b) => b.id - a.id);
    return out;
  }, [listings, category, query, priceMax, sellerFilter, townFilter, verifiedOnly, styleFilter, sort]);

  const justLanded = useMemo(() => [...listings].sort((a, b) => b.id - a.id).slice(0, 8), [listings]);

  const allDealers = useMemo(() => getAllDealers(), []);
  const dealers = useMemo(() => allDealers.slice(0, 4), [allDealers]);

  function runValuation(e) {
    e.preventDefault();
    const make = valForm.make.trim().toLowerCase();
    const model = valForm.model.trim().toLowerCase();
    let pool = listings.filter((l) => (make ? l.make.toLowerCase().includes(make) : true) && (model ? l.title.toLowerCase().includes(model) : true));
    if (pool.length === 0 && make) pool = listings.filter((l) => l.make.toLowerCase().includes(make));
    if (pool.length === 0) pool = listings;
    const prices = pool.map((l) => l.price).sort((a, b) => a - b);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const low = Math.round((avg * 0.9) / 50) * 50;
    const high = Math.round((avg * 1.1) / 50) * 50;
    setValuation({ low, high, count: pool.length });
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function scrollCarousel(dir) {
    carouselRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  }

  function goToCategory(id) {
    setCategory(id);
    setPriceMax("");
    scrollTo("listings");
  }

  return (
    <>
      {/* ---------- Hero / discovery homepage ---------- */}
      <section className="hero-v2">
        <img src={HERO_PHOTO} alt="" className="hero-v2-img" onError={(e) => { e.target.style.display = "none"; }} />
        <div className="hero-v2-shade" />
        <div className="hero-v2-grid" />
        <div className="hero-v2-content">
          <div className="hero-v2-copy">
            <span className="hero-v2-kicker">Buy. Sell. Ride.</span>
            <h1>Northern Ireland&apos;s<br /><em>Motorcycle Marketplace</em></h1>
            <p>Find the bike, live the ride. Road, race, dirt and trials — all in one place.</p>
            <div className="hero-v2-actions">
              <button className="btn btn-amber hero-primary" onClick={() => scrollTo("listings")}>Browse bikes →</button>
              <Link href="/sell" className="btn hero-secondary">Sell your bike</Link>
            </div>
          </div>
          <div className="hero-v2-statbar">
            <div><strong>{listings.length}</strong><span>bikes listed</span></div>
            <div><strong>{allDealers.length}</strong><span>dealers</span></div>
            <div><strong>{CATEGORIES.length}</strong><span>bike categories</span></div>
          </div>
        </div>
      </section>

      <div className="search-v2-wrap">
        <div className="search-v2">
          <div className="search-v2-top">
            <div><span className="search-v2-eyebrow">Start your search</span><h2>What are you looking for?</h2></div>
            <button
              className="search-clear"
              onClick={() => {
                setQuery(""); setCategory("all"); setPriceMax(""); setTownFilter("");
                setStyleFilter(""); setSellerFilter("all"); setVerifiedOnly(false);
              }}
            >
              Clear filters
            </button>
          </div>
          <div className="search-v2-row">
            <label className="search-v2-main">Make / model
              <input type="text" placeholder="Yamaha R6, KTM 300, BMW GS…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
            <label>Type
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="all">Any type</option>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </label>
            <label>Max price
              <select value={priceMax} onChange={(e) => setPriceMax(e.target.value)}>
                <option value="">Any price</option>
                {PRICE_OPTIONS.map((p) => <option key={p} value={p}>{gbp(p)}</option>)}
              </select>
            </label>
            <label>Location
              <select value={townFilter} onChange={(e) => setTownFilter(e.target.value)}>
                <option value="">Anywhere in NI</option>
                {NI_TOWNS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <button className="btn btn-amber search-v2-btn" onClick={() => scrollTo("listings")}>Search bikes</button>
          </div>
          <div className="quick-searches">
            <span>Popular:</span>
            {["Yamaha", "Honda", "Kawasaki", "KTM", "BMW", "Ducati"].map((make) => (
              <button key={make} onClick={() => { setQuery(make); scrollTo("listings"); }}>{make}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Just landed ---------- */}
      <section className="landed-section landed-v2">
        <div className="section-head-v2">
          <div><span className="section-kicker">Fresh stock</span><h2>Just landed</h2><p>See what&apos;s just arrived on NI Bikes.</p></div>
          <div className="section-head-actions">
            <button className="text-link" onClick={() => scrollTo("listings")}>View all bikes →</button>
            <div className="carousel-nav">
              <button onClick={() => scrollCarousel(-1)} aria-label="Scroll left">←</button>
              <button onClick={() => scrollCarousel(1)} aria-label="Scroll right">→</button>
            </div>
          </div>
        </div>
        <div className="carousel carousel-v2" ref={carouselRef}>
          {justLanded.map((l) => (
            <Link key={l.id} href={`/bikes/${l.slug}`} className="carousel-card carousel-card-v2">
              <button className={"save-btn" + (saved.has(l.id) ? " save-btn-active" : "")} onClick={(e) => toggleSaved(l.id, e)} aria-label="Save bike">
                <HeartIcon filled={saved.has(l.id)} />
              </button>
              <div className="carousel-photo carousel-photo-v2"><PhotoOrArt photos={l.photos} category={l.category} size="md" /></div>
              <div className="carousel-body">
                <span className="mini-cat">{CATEGORIES.find((c) => c.id === l.category)?.label}</span>
                <h3>{l.year} {l.title}</h3>
                <div className="card-price">{gbp(l.price)}</div>
                <div className="card-meta-line">{l.location} · {l.sellerType === "dealer" ? "Trade" : "Private"}{l.verified && " · ✓ Verified"}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- What are you riding: 5 photographic tiles ---------- */}
      <section className="riding-section riding-v2">
        <div className="section-head-v2 centered">
          <span className="section-kicker">Shop by category</span><h2>What are you riding?</h2><p>Whatever your style, start here.</p>
        </div>
        <div className="riding-grid riding-grid-v2">
          {CATEGORIES.map((c, i) => (
            <button key={c.id} className="riding-tile riding-tile-v2" onClick={() => goToCategory(c.id)}>
              <img src={CATEGORY_PHOTOS[c.id]} alt="" onError={(e) => { e.target.style.display = "none"; }} />
              <span className="riding-tile-overlay" />
              <span className="riding-tile-number">0{i + 1}</span>
              <span className="riding-tile-label"><BikeMark category={c.id} size={26} /><span><b>{c.label}</b><small>{c.blurb}</small></span></span>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- Find your next bike: style tags ---------- */}
      <section className="style-section style-v2">
        <div className="section-head-v2 centered">
          <span className="section-kicker">Shop by style</span><h2>Find your next bike</h2><p>Sometimes you know the feeling before you know the bike.</p>
        </div>
        <div className="style-grid style-grid-v2">
          {STYLE_TAGS.map((s) => (
            <button
              key={s}
              className={"style-chip style-chip-v2" + (styleFilter === s ? " style-chip-active" : "")}
              onClick={() => { setStyleFilter(styleFilter === s ? "" : s); setCategory("all"); scrollTo("listings"); }}
            >
              <span>{s}</span><b>→</b>
            </button>
          ))}
        </div>
      </section>

      {/* ---------- For the serious riders: dark motorsport section ---------- */}
      <section className="serious-section serious-v2" id="serious">
        <div className="serious-v2-inner">
          <div className="serious-v2-copy">
            <span className="section-kicker">The other side of two wheels</span>
            <h2>For the serious riders.</h2>
            <p>Race bikes. Motocross. Enduro. Trials. The machines built for competition, not commuting.</p>
            <button className="btn btn-amber" onClick={() => goToCategory("race")}>Explore serious bikes →</button>
          </div>
          <div className="serious-grid serious-grid-v2">
            {SERIOUS.map((id) => (
              <button key={id} className="serious-tile serious-tile-v2" onClick={() => goToCategory(id)}>
                <img src={CATEGORY_PHOTOS[id]} alt="" onError={(e) => { e.target.style.display = "none"; }} />
                <span className="serious-tile-overlay" />
                <span className="serious-tile-label">{categoryMeta(id).label}<b>→</b></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Quick tools: teasers for valuation / dealers / sell ---------- */}
      <section className="tools-v2">
        <div
          className="tool-card tool-card-dark"
          role="button"
          tabIndex={0}
          onClick={() => scrollTo("valuation")}
          onKeyDown={(e) => e.key === "Enter" && scrollTo("valuation")}
        >
          <div><span className="section-kicker">Thinking of selling?</span><h3>What&apos;s my bike worth?</h3><p>See what similar bikes are currently advertised across Northern Ireland.</p></div>
          <b>Get an estimate →</b>
        </div>
        <div
          className="tool-card"
          role="button"
          tabIndex={0}
          onClick={() => scrollTo("dealers")}
          onKeyDown={(e) => e.key === "Enter" && scrollTo("dealers")}
        >
          <div><span className="section-kicker">Shop local</span><h3>Find a motorcycle dealer</h3><p>Browse trade stock from dealers listing across Northern Ireland.</p></div>
          <b>Browse dealers →</b>
        </div>
        <Link href="/sell?type=private" className="tool-card tool-card-accent">
          <div><span className="section-kicker">Ready to sell?</span><h3>List your bike</h3><p>Put your bike in front of Northern Ireland&apos;s motorcycle community.</p></div>
          <b>Sell your bike →</b>
        </Link>
      </section>

      {/* ---------- Shop NI Dealers ---------- */}
      <section className="dealers-section dealers-v2" id="dealers">
        <div className="section-head-v2">
          <div><span className="section-kicker">Trade stock</span><h2>Shop NI dealers</h2><p>Find your next bike from a local motorcycle dealer.</p></div>
          <Link href="/dealers" className="text-link">View all dealers →</Link>
        </div>
        <div className="dealers-grid dealers-grid-v2">
          {dealers.map((d) => (
            <Link key={d.name} href={`/dealers/${d.slug}`} className="dealer-card dealer-card-v2">
              <div className="dealer-logo">{d.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
              <div className="dealer-v2-info"><h3>{d.name}</h3><p>{d.town} · ★ {d.rating.toFixed(1)}</p><span>{d.count} {d.count === 1 ? "bike" : "bikes"} for sale</span></div>
            </Link>
          ))}
        </div>
        <p className="dealers-hint">Tap a dealer&apos;s card for contact details and their full profile.</p>
      </section>

      <div className="ad-banner ad-v2">
        <span className="ad-label">Advertisement · Ballymena BMW Motorrad</span>
        <div className="ad-banner-body">
          <div className="ad-banner-text">
            <strong>New BMW R1250GS Adventure — PCP from £189/month.</strong>
            <span>9.9% APR representative, subject to status. Part-exchange welcome. Terms and conditions apply.</span>
          </div>
          <button className="btn btn-ghost ad-cta">Book a test ride →</button>
        </div>
      </div>

      {/* ---------- Listings (functional search results) ---------- */}
      <main className="main" id="listings">
        <div className="main-head">
          <div>
            <h2>{categoryMeta(category)?.label ?? "All bikes"}{styleFilter ? " — " + styleFilter : ""}</h2>
            <p className="muted">{categoryMeta(category)?.blurb} — {filtered.length} {filtered.length === 1 ? "bike" : "bikes"} listed</p>
          </div>
          <div className="main-controls">
            <div className="seller-filter" role="group" aria-label="Filter by seller type">
              <button className={"pill" + (sellerFilter === "all" ? " pill-active" : "")} onClick={() => setSellerFilter("all")}>All sellers</button>
              <button className={"pill" + (sellerFilter === "dealer" ? " pill-active pill-trade" : "")} onClick={() => setSellerFilter("dealer")}>Trade</button>
              <button className={"pill" + (sellerFilter === "private" ? " pill-active pill-private" : "")} onClick={() => setSellerFilter("private")}>Private</button>
              <button className={"pill" + (verifiedOnly ? " pill-active" : "")} onClick={() => setVerifiedOnly((v) => !v)}>Verified only</button>
              {styleFilter && <button className="pill pill-active" onClick={() => setStyleFilter("")}>{styleFilter} ✕</button>}
            </div>
            <label className="sort">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="year">Year: newest first</option>
              </select>
            </label>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <p>No bikes match that search yet.</p>
            <p className="muted">Try a different type, style, town, or clear the search box above.</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((l, i) => (
              <Fragment key={l.id}>
                <Link href={`/bikes/${l.slug}`} className="card">
                  <button className={"save-btn" + (saved.has(l.id) ? " save-btn-active" : "")} onClick={(e) => toggleSaved(l.id, e)} aria-label="Save bike">
                    <HeartIcon filled={saved.has(l.id)} />
                  </button>
                  <div className="card-photo">
                    <PhotoOrArt photos={l.photos} category={l.category} size="lg" />
                    <span className="card-cat">{CATEGORIES.find((c) => c.id === l.category)?.label}</span>
                  </div>
                  <div className="card-body">
                    <div className="card-seller-row">
                      <span className={"seller-tag " + (l.sellerType === "dealer" ? "seller-tag-trade" : "seller-tag-private")}>
                        {l.sellerType === "dealer" ? l.sellerName : "Private seller"}
                      </span>
                      {l.verified && <span className="verified-tag">Verified</span>}
                    </div>
                    <h3>{l.year} {l.title}</h3>
                    <p className="card-subtitle">{l.engine} · {l.location}</p>
                    <div className="stat-row">
                      <div className="stat-item"><StatIcon type="gearbox" /><strong>{l.transmission}</strong><span>Gearbox</span></div>
                      <div className="stat-item"><StatIcon type="mileage" /><strong>{milesShort(l.mileage)}</strong><span>Miles</span></div>
                      <div className="stat-item"><StatIcon type="engine" /><strong>{engineShort(l.engine)}</strong><span>Engine</span></div>
                      <div className="stat-item"><StatIcon type="fuel" /><strong>{l.fuel}</strong><span>Fuel</span></div>
                    </div>
                    <div className="price-pill">{gbp(l.price)}</div>
                  </div>
                </Link>
                {i === 4 && (
                  <div className="card ad-square" key="ad-square">
                    <span className="ad-label">Sponsored · Lagan Motorcycles</span>
                    <div className="ad-square-body">
                      <strong>Winter Service Special — £89</strong>
                      <span>Full safety check, oil and filter change. Any make, any model.</span>
                      <button className="btn btn-amber ad-cta">Book now</button>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </main>

      {/* ---------- Valuation tool ---------- */}
      <section className="valuation-section" id="valuation">
        <div className="valuation-inner">
          <div className="valuation-copy">
            <span className="valuation-kicker">💷 What&apos;s my bike worth?</span>
            <h2>Thinking of selling?</h2>
            <p className="section-sub">Find out what bikes like yours are currently advertised for across Northern Ireland.</p>
          </div>
          <form className="valuation-form" onSubmit={runValuation}>
            <div className="form-row">
              <label>Make<input type="text" placeholder="Yamaha" value={valForm.make} onChange={(e) => setValForm((f) => ({ ...f, make: e.target.value }))} /></label>
              <label>Model<input type="text" placeholder="R6" value={valForm.model} onChange={(e) => setValForm((f) => ({ ...f, model: e.target.value }))} /></label>
            </div>
            <div className="form-row">
              <label>Year<input type="number" min="1950" max={new Date().getFullYear() + 1} value={valForm.year} onChange={(e) => setValForm((f) => ({ ...f, year: e.target.value }))} /></label>
              <label>Mileage<input type="number" min="0" placeholder="18000" value={valForm.mileage} onChange={(e) => setValForm((f) => ({ ...f, mileage: e.target.value }))} /></label>
            </div>
            <button type="submit" className="btn btn-amber">Get my estimate</button>
            {valuation && (
              <div className="valuation-result">
                <span className="muted-sm">Estimated NI market value</span>
                <strong>{gbp(valuation.low)} – {gbp(valuation.high)}</strong>
                <span className="muted-sm">{valuation.count} similar {valuation.count === 1 ? "bike" : "bikes"} currently listed</span>
                <Link href="/sell?type=private" className="btn btn-ghost">Sell yours</Link>
              </div>
            )}
            <p className="muted-sm tier-note">Estimate based on current NI Bikes listings, not a formal valuation.</p>
          </form>
        </div>
      </section>

      {/* ---------- Sell your bike: two paths ---------- */}
      <section className="sell-section" id="sell">
        <div className="sell-inner">
          <h2>Sell your bike</h2>
          <p className="section-sub">Get it in front of Northern Ireland&apos;s motorcycle community.</p>
          <div className="path-grid">
            <div className="path-card">
              <span className="path-name">Private seller</span>
              <p>Free listing. List your bike in minutes, reach buyers across NI.</p>
              <Link href="/sell?type=private" className="btn btn-amber">List your bike →</Link>
            </div>
            <div className="path-card">
              <span className="path-name">Dealer</span>
              <p>Professional stock solutions — bulk listings, a branded profile, and priority placement.</p>
              <Link href="/sell?type=dealer" className="btn btn-ghost path-btn-ghost">List your bike →</Link>
            </div>
          </div>
          <p className="muted-sm tier-note">Illustrative — no payment is processed in this demo.</p>
        </div>
      </section>
    </>
  );
}
