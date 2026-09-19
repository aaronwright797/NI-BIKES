import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nibikes.co.uk"),
  title: {
    default: "NI Bikes — Northern Ireland's Motorcycle Marketplace",
    template: "%s | NI Bikes",
  },
  description: "Buy and sell motorcycles across Northern Ireland. Road, race, motocross, enduro and trials bikes from trusted dealers and private sellers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="wrap">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
