"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton({ className }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <button type="button" className={className} onClick={logout} disabled={loading}>
      {loading ? "Logging out…" : "Log out"}
    </button>
  );
}
