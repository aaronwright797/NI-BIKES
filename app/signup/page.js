import Link from "next/link";
import SignupForm from "@/components/SignupForm";

export const metadata = {
  title: "Sign Up",
  description: "Create your NI Bikes account — free for private sellers, with dealer stock solutions available.",
  alternates: { canonical: "/signup" },
};

export default async function SignupPage({ searchParams }) {
  const sp = await searchParams;
  const next = typeof sp?.next === "string" ? sp.next : "/";
  return (
    <div className="detail-page">
      <nav className="breadcrumb"><Link href="/">Home</Link> / Sign up</nav>
      <SignupForm next={next} />
    </div>
  );
}
