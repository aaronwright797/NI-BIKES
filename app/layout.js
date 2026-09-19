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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("display_name, account_type").eq("id", user.id).single();
    profile = data;
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
