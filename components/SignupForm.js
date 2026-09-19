"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { withTimeout } from "@/utils/withTimeout";

export default function SignupForm() {
  const router = useRouter();
  const [accountType, setAccountType] = useState("private");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!displayName.trim()) { setError(accountType === "dealer" ? "Add your dealership name." : "Add your name."); return; }
    if (password !== confirmPassword) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: signUpError } = await withTimeout(supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName.trim(), account_type: accountType },
        },
      }));
      if (signUpError) { setError(signUpError.message); return; }

      if (data.session) {
        router.push("/");
        router.refresh();
      } else {
        setCheckEmail(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="sheet-form" style={{ maxWidth: 440, margin: "0 auto" }}>
        <h2>Check your email</h2>
        <p className="muted">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in.</p>
        <div className="sheet-actions">
          <Link href="/login" className="btn btn-amber">Go to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sheet-form" style={{ maxWidth: 440, margin: "0 auto" }}>
      <h2>Sign up</h2>
      <p className="muted">Free for private sellers, with dealer stock solutions available.</p>
      <div className="seller-toggle" role="group" aria-label="Account type">
        <button type="button" className={"toggle-btn" + (accountType === "private" ? " toggle-btn-active" : "")} onClick={() => setAccountType("private")}>Private seller</button>
        <button type="button" className={"toggle-btn" + (accountType === "dealer" ? " toggle-btn-active" : "")} onClick={() => setAccountType("dealer")}>Trade / dealer</button>
      </div>
      <form onSubmit={submit} className="form">
        <label>{accountType === "dealer" ? "Dealership name" : "Your name"}
          <input type="text" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label>Email<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <label>Confirm password<input type="password" autoComplete="new-password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></label>
        {error && <p className="form-error">{error}</p>}
        <div className="sheet-actions">
          <button type="submit" className="btn btn-amber" disabled={loading}>{loading ? "Signing up…" : "Sign up"}</button>
        </div>
      </form>
      <p className="muted-sm tier-note">Already have an account? <Link href="/login">Log in</Link></p>
    </div>
  );
}
