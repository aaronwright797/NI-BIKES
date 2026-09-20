import { getActiveListingSlugs, getDealersWithStock } from "@/lib/listings";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://nibikes.co.uk";
  const staticRoutes = ["", "/dealers", "/sell"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
  const [bikeSlugs, dealers] = await Promise.all([getActiveListingSlugs(), getDealersWithStock()]);
  const bikeRoutes = bikeSlugs.map((slug) => ({
    url: `${base}/bikes/${slug}`,
    lastModified: new Date(),
  }));
  const dealerRoutes = dealers.map((d) => ({
    url: `${base}/dealers/${d.slug}`,
    lastModified: new Date(),
  }));
  return [...staticRoutes, ...bikeRoutes, ...dealerRoutes];
}
