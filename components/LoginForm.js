"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) { setError(signInError.message); return; }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="sheet-form" style={{ maxWidth: 440, margin: "0 auto" }}>
      <h2>Log in</h2>
      <p className="muted">Welcome back.</p>
      <form onSubmit={submit} className="form">
        <label>Email<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="form-error">{error}</p>}
        <div className="sheet-actions">
          <button type="submit" className="btn btn-amber" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
        </div>
      </form>
      <p className="muted-sm tier-note">No account? <Link href="/signup">Sign up</Link></p>
    </div>
  );
}
