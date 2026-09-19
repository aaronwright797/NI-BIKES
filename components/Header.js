"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function Header({ user, profile }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function scrollTo(id) {
    setMobileNavOpen(false);
    if (pathname !== "/") {
      router.push("/#" + id);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className="hdr">
      <div className="hdr-inner">
        <Link href="/" className="brand"><img src="/logo.png" alt="NI Bikes" className="brand-logo" /></Link>
        <nav className="nav">
          <button onClick={() => scrollTo("listings")}>Browse</button>
          <Link href="/sell">Sell</Link>
          <button onClick={() => scrollTo("dealers")}>Dealers</button>
          <button onClick={() => scrollTo("valuation")}>Valuations</button>
          <button onClick={() => scrollTo("serious")}>Advice</button>
        </nav>
        <div className="auth-nav">
          {user ? (
            <>
              <span className="auth-nav-name">Hi, {profile?.display_name || "there"}</span>
              <LogoutButton className="btn btn-ghost" />
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">Log in</Link>
              <Link href="/signup" className="btn btn-ghost">Sign up</Link>
            </>
          )}
        </div>
        <Link href="/sell" className="btn btn-amber sell-cta-header">Sell your bike</Link>
        <button
          className="mobile-nav-toggle"
          aria-label="Menu"
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
      {mobileNavOpen && (
        <nav className="mobile-nav-panel">
          <button onClick={() => scrollTo("listings")}>Browse</button>
          <Link href="/sell" onClick={() => setMobileNavOpen(false)}>Sell</Link>
          <button onClick={() => scrollTo("dealers")}>Dealers</button>
          <button onClick={() => scrollTo("valuation")}>Valuations</button>
          <button onClick={() => scrollTo("serious")}>Advice</button>
          {user ? (
            <>
              <span className="mobile-nav-name">Hi, {profile?.display_name || "there"}</span>
              <LogoutButton className="mobile-nav-logout" />
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileNavOpen(false)}>Log in</Link>
              <Link href="/signup" onClick={() => setMobileNavOpen(false)}>Sign up</Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
