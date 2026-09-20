import Link from "next/link";
import { getDealersWithStock } from "@/lib/listings";

export const metadata = {
  title: "Motorcycle Dealers in Northern Ireland",
  description: "Browse trusted motorcycle dealers across Northern Ireland and see their current stock on NI Bikes.",
  alternates: { canonical: "/dealers" },
};

export const revalidate = 300;

export default async function DealersDirectory() {
  const dealers = await getDealersWithStock();
  return (
    <div className="dealer-directory">
      <div className="section-head-v2">
        <div><span className="section-kicker">Trade stock</span><h1>NI dealers</h1><p>Every dealer currently listing on NI Bikes.</p></div>
      </div>
      <div className="dealers-grid dealers-grid-v2">
        {dealers.map((d) => (
          <Link key={d.name} href={`/dealers/${d.slug}`} className="dealer-card dealer-card-v2">
            <div className="dealer-logo">{d.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</div>
            <div className="dealer-v2-info"><h3>{d.name}</h3><p>{d.town} · ★ {d.rating.toFixed(1)}</p><span>{d.count} {d.count === 1 ? "bike" : "bikes"} for sale</span></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
