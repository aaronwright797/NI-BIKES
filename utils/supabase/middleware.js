import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Session refresh is a best-effort enhancement — if Supabase env vars
  // are missing/misconfigured or the auth server is unreachable, fall
  // through to the unmodified response rather than 500ing every route
  // this proxy runs on (effectively the whole site).
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase env vars are missing — skipping session refresh.");
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    });

    // Refresh the session if expired — required for Server Components,
    // which can't write cookies themselves.
    await supabase.auth.getUser();
  } catch (error) {
    console.error("Supabase session refresh failed:", error);
  }

  return supabaseResponse;
}
