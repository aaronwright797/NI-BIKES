import Link from "next/link";
import { redirect } from "next/navigation";
import SellForm from "@/components/SellForm";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Sell Your Bike",
  description: "List your motorcycle for sale on NI Bikes — free for private sellers, with dealer stock solutions available.",
  alternates: { canonical: "/sell" },
};

export default async function SellPage({ searchParams }) {
  const sp = await searchParams;
  const initialType = sp?.type === "dealer" ? "dealer" : "private";
  const next = `/sell${initialType === "dealer" ? "?type=dealer" : ""}`;

  // Publishing a listing requires a real seller_id, so this page is
  // only for signed-in users — send anyone else to log in first and
  // bring them straight back here afterwards. Mirrors the try/catch
  // pattern in app/layout.js: never let an auth-check failure crash
  // the page, but here it means "treat as signed out" rather than
  // "treat as signed in", since submitting while unauthenticated would
  // just fail against RLS anyway.
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    if (error?.digest) throw error;
    console.error("Failed to check auth session for /sell:", error);
  }
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return (
    <div className="detail-page">
      <nav className="breadcrumb"><Link href="/">Home</Link> / Sell your bike</nav>
      <SellForm initialType={initialType} />
    </div>
  );
}
