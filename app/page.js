import HomeExplorer from "@/components/HomeExplorer";

export const metadata = {
  title: { absolute: "NI Bikes — Northern Ireland's Motorcycle Marketplace" },
  description: "Buy and sell motorcycles across Northern Ireland. Browse road, race, motocross, enduro and trials bikes from trusted dealers and private sellers.",
};

export default function Home() {
  return <HomeExplorer />;
}
