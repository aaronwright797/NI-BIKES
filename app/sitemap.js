import { SEED_LISTINGS, getAllDealers } from "@/lib/data";

export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://ni-bikes.vercel.app";
  const staticRoutes = ["", "/dealers", "/sell"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const bikeRoutes = SEED_LISTINGS.map((l) => ({
    url: `${base}/bikes/${l.slug}`,
    lastModified: new Date(),
  }));
  const dealerRoutes = getAllDealers().map((d) => ({
    url: `${base}/dealers/${d.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...bikeRoutes, ...dealerRoutes];
}
