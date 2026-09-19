"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { withTimeout } from "@/utils/withTimeout";
import { friendlyAuthError } from "@/utils/friendlyAuthError";

export default function LogoutButton({ className }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signOutError } = await withTimeout(supabase.auth.signOut());
      if (signOutError) {
        // friendlyAuthError logs network-layer failures with extra
        // diagnostic detail; log anything else too, so a logout
        // failure is never silent.
        friendlyAuthError(signOutError, "Log-out");
        console.error("Logout failed:", signOutError);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      friendlyAuthError(err, "Log-out");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" className={className} onClick={logout} disabled={loading}>
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
