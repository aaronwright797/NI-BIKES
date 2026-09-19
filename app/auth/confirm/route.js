import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Handles the link in Supabase's "Confirm signup" email
// (?token_hash=...&type=signup&next=/), once the project's email
// template is pointed at this route. See supabase/README.md.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/login?error=confirmation_failed", request.url));
}
