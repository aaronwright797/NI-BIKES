import Link from "next/link";
import { notFound } from "next/navigation";
import { gbp } from "@/lib/data";
import { getDealersWithStock, getDealerBySlug } from "@/lib/listings";
import PhotoOrArt from "@/components/PhotoOrArt";

export const revalidate = 300;

export async function generateStaticParams() {
  const dealers = await getDealersWithStock();
  return dealers.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dealer = await getDealerBySlug(slug);
  if (!dealer) return {};
  const title = `${dealer.name} — Motorcycle Dealer in ${dealer.town}`;
  const description = `${dealer.bio} ${dealer.count} ${dealer.count === 1 ? "bike" : "bikes"} currently in stock.`.slice(0, 300);
  return { title, description, alternates: { canonical: `/dealers/${dealer.slug}` } };
}

export default async function DealerPage({ params }) {
  const { slug } = await params;
  const dealer = await getDealerBySlug(slug);
  if (!dealer) notFound();

  const stock = dealer.stock;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: dealer.name,
    description: dealer.bio,
    address: dealer.address,
    telephone: dealer.phone,
    email: dealer.email,
    aggregateRating: { "@type": "AggregateRating", ratingValue: dealer.rating, reviewCount: dealer.count || 1 },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="breadcrumb"><Link href="/">Home</Link> / <Link href="/dealers">Dealers</Link> / {dealer.name}</nav>

      <div className="dealer-hero">
        <div className="dealer-logo dealer-logo-lg">{dealer.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
        <div>
          <h1>{dealer.name}</h1>
          <div className="sheet-meta-row">
            <span className="dealer-rating">★ {dealer.rating.toFixed(1)}</span>
            <span>{dealer.town}</span>
            <span>{dealer.count} {dealer.count === 1 ? "bike" : "bikes"} for sale</span>
          </div>
        </div>
      </div>

      <div className="detail-page" style={{ paddingTop: 0 }}>
        <p className="detail-desc dealer-bio">{dealer.bio}</p>

        <h2 className="detail-section-title">Contact &amp; opening hours</h2>
        <dl className="detail-spec-table dealer-contact-table">
          <div><dt>Address</dt><dd>{dealer.address}</dd></div>
          <div><dt>Phone</dt><dd>{dealer.phone}</dd></div>
          <div><dt>Email</dt><dd>{dealer.email}</dd></div>
          <div><dt>Hours</dt><dd>{dealer.hours}</dd></div>
        </dl>

        <h2 className="detail-section-title">Current stock</h2>
        <div className="dealer-stock-list">
          {stock.map((l) => (
            <Link key={l.id} href={`/bikes/${l.slug}`} className="dealer-stock-item">
              <span className="dealer-stock-thumb"><PhotoOrArt photos={l.photos} category={l.category} size="sm" /></span>
              <span className="dealer-stock-info"><b>{l.year} {l.title}</b><span>{gbp(l.price)}</span></span>
            </Link>
          ))}
          {stock.length === 0 && <p className="muted">No active stock listed right now.</p>}
        </div>

        <div className="detail-actions">
          <a className="btn btn-amber" href={"tel:" + dealer.phone.replace(/\s/g, "")}>Call dealer</a>
          <a className="btn btn-ghost" href={"mailto:" + dealer.email}>Email dealer</a>
        </div>
      </div>
    </div>
  );
}
