import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Log In",
  description: "Log in to your NI Bikes account.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  const next = typeof sp?.next === "string" ? sp.next : "/";
  return (
    <div className="detail-page">
      <nav className="breadcrumb"><Link href="/">Home</Link> / Log in</nav>
      <LoginForm next={next} />
    </div>
  );
}
