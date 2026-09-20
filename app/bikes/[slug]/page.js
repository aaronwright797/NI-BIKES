import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, gbp, milesText } from "@/lib/data";
import { getActiveListingSlugs, getListingBySlug } from "@/lib/listings";
import PhotoOrArt from "@/components/PhotoOrArt";
import SaveButton from "@/components/SaveButton";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getActiveListingSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) return {};
  const title = `${listing.year} ${listing.title} for sale in ${listing.location} — ${gbp(listing.price)}`;
  const description = `${listing.year} ${listing.title}, ${milesText(listing.mileage)}, ${listing.location}. ${listing.desc}`.slice(0, 300);
  return {
    title,
    description,
    alternates: { canonical: `/bikes/${listing.slug}` },
    openGraph: {
      title,
      description,
      images: listing.photos && listing.photos.length ? [listing.photos[0]] : undefined,
    },
  };
}

export default async function ListingPage({ params }) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);
  if (!listing) notFound();

  const categoryLabel = CATEGORIES.find((c) => c.id === listing.category)?.label;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${listing.year} ${listing.title}`,
    manufacturer: listing.make,
    vehicleModelDate: String(listing.year),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: listing.mileage, unitCode: "SMI" },
    vehicleTransmission: listing.transmission,
    fuelType: listing.fuel,
    description: listing.desc,
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "GBP",
      availability: "https://schema.org/InStock",
      areaServed: listing.location,
      seller: {
        "@type": listing.sellerType === "dealer" ? "AutoDealer" : "Person",
        name: listing.sellerName,
      },
    },
  };

  return (
    <div className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="breadcrumb"><Link href="/">Home</Link> / <Link href="/#listings">Bikes</Link> / {listing.year} {listing.title}</nav>

      <div className="detail-gallery"><PhotoOrArt photos={listing.photos} category={listing.category} size="xl" /></div>

      <div className="detail-title-row">
        <div>
          <h1>{listing.year} {listing.title}</h1>
          <div className="sheet-meta-row">
            <span>{gbp(listing.price)}</span>
            <span>📍 {listing.location}</span>
            <span>{categoryLabel}</span>
            <span>{milesText(listing.mileage)}</span>
          </div>
        </div>
        <SaveButton />
      </div>

      <h2 className="detail-section-title">Bike details</h2>
      <dl className="detail-spec-table">
        <div><dt>Year</dt><dd>{listing.year}</dd></div>
        <div><dt>Mileage</dt><dd>{milesText(listing.mileage)}</dd></div>
        <div><dt>Engine</dt><dd>{listing.engine}</dd></div>
        <div><dt>Transmission</dt><dd>{listing.transmission}</dd></div>
        <div><dt>Owners</dt><dd>{listing.owners}</dd></div>
        <div><dt>MOT</dt><dd>{listing.mot}</dd></div>
        <div><dt>Registration</dt><dd>{listing.registration}</dd></div>
      </dl>

      <h2 className="detail-section-title">Description</h2>
      <p className="detail-desc">{listing.desc}</p>

      <h2 className="detail-section-title">Trust checks</h2>
      <ul className="checks-list">
        <li className={listing.checks.registration ? "check-yes" : "check-no"}>{listing.checks.registration ? "✓" : "—"} Registration checked</li>
        <li className={listing.checks.mot ? "check-yes" : "check-no"}>{listing.checks.mot ? "✓" : "—"} MOT checked</li>
        <li className={listing.checks.finance ? "check-yes" : "check-no"}>{listing.checks.finance ? "✓" : "—"} Finance checked</li>
        <li className={listing.checks.serviceHistory ? "check-yes" : "check-no"}>{listing.checks.serviceHistory ? "✓" : "—"} Service history</li>
        <li className={listing.checks.hpi ? "check-yes" : "check-no"}>{listing.checks.hpi ? "✓" : "—"} HPI available</li>
      </ul>
      <p className="muted-sm tier-note">Checks shown are illustrative — no live verification is connected yet.</p>

      <h2 className="detail-section-title">Seller</h2>
      <div className="seller-card">
        {listing.dealerSlug ? (
          <Link href={`/dealers/${listing.dealerSlug}`} className={"seller-tag seller-tag-trade"}>{listing.sellerName}</Link>
        ) : (
          <span className="seller-tag seller-tag-private">Private seller</span>
        )}
        {listing.verified && <span className="verified-tag">Verified seller</span>}
      </div>

      <div className="detail-actions">
        <button className="btn btn-amber" disabled>Message seller</button>
        <button className="btn btn-ghost" disabled>Call seller</button>
      </div>
      <p className="not-wired-note">In-app messaging and calling are coming soon — not yet connected in this build.</p>
    </div>
  );
}
