import HomeExplorer from "@/components/HomeExplorer";
import { getActiveListings, getDealersWithStock } from "@/lib/listings";

export const metadata = {
  title: { absolute: "NI Bikes — Northern Ireland's Motorcycle Marketplace" },
  description: "Buy and sell motorcycles across Northern Ireland. Browse road, race, motocross, enduro and trials bikes from trusted dealers and private sellers.",
  alternates: { canonical: "/" },
};

// Revalidate periodically so new listings/dealers show up without a
// full redeploy, while still serving a cached page most of the time.
export const revalidate = 300;

export default async function Home() {
  const [listings, dealers] = await Promise.all([getActiveListings(), getDealersWithStock()]);
  return <HomeExplorer listings={listings} dealers={dealers} />;
}
