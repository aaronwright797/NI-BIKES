import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nibikes.co.uk"),
  title: {
    default: "NI Bikes — Northern Ireland's Motorcycle Marketplace",
    template: "%s | NI Bikes",
  },
  description: "Buy and sell motorcycles across Northern Ireland. Road, race, motocross, enduro and trials bikes from trusted dealers and private sellers.",
};

export default async function RootLayout({ children }) {
  // Auth state only affects what the header shows (logged in vs. logged
  // out) — it must never take the whole site down if Supabase env vars
  // are missing/misconfigured or the auth server is unreachable.
  let user = null;
  let profile = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
    if (user) {
      const { data: profileData } = await supabase.from("profiles").select("display_name, account_type").eq("id", user.id).single();
      profile = profileData;
    }
  } catch (error) {
    // Next.js signals things like "this route needs dynamic rendering"
    // and redirect()/notFound() by throwing an internal error tagged
    // with a `digest` — those must always propagate, never be treated
    // as a failed auth lookup.
    if (error?.digest) throw error;
    console.error("Failed to load auth session:", error);
  }

  return (
    <html lang="en">
      <body className="wrap">
        <Header user={user} profile={profile} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
