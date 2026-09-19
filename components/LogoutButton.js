"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { withTimeout } from "@/utils/withTimeout";

export default function LogoutButton({ className }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      const supabase = createClient();
      await withTimeout(supabase.auth.signOut());
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
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
