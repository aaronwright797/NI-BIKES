import Link from "next/link";
import SellForm from "@/components/SellForm";

export const metadata = {
  title: "Sell Your Bike",
  description: "List your motorcycle for sale on NI Bikes — free for private sellers, with dealer stock solutions available.",
  alternates: { canonical: "/sell" },
};

export default async function SellPage({ searchParams }) {
  const sp = await searchParams;
  const initialType = sp?.type === "dealer" ? "dealer" : "private";
  return (
    <div className="detail-page">
      <nav className="breadcrumb"><Link href="/">Home</Link> / Sell your bike</nav>
      <SellForm initialType={initialType} />
    </div>
  );
}
