import { isAuthRetryableFetchError } from "@supabase/supabase-js";

// Turns an auth failure into a message safe to show a real user, while
// logging the actual diagnostic detail to the console. A network-layer
// failure (DNS, TLS, connection refused, a rejected CORS preflight —
// anything before a real response comes back) never reaches us as a
// raw fetch TypeError: @supabase/auth-js catches that itself and
// re-wraps it as an AuthRetryableFetchError, returned through the
// normal `{ data, error }` result rather than thrown — so this must be
// called on both a returned `error` field AND anything caught from a
// try/catch (our own thrown errors — missing config, our timeout —
// aren't retryable-fetch errors and just fall through to their own
// message).
export function friendlyAuthError(err, context = "auth request") {
  const isNetworkFailure = isAuthRetryableFetchError(err) || err instanceof TypeError;
  if (isNetworkFailure) {
    console.error(
      `${context} failed at the network level ("${err?.message}"). ` +
      `Configured Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)"}. ` +
      "Check: the URL/key are correct for this exact project (Supabase dashboard → " +
      "Project Settings → API), the project isn't paused, and — most directly — " +
      "open the browser's Network tab and see what host the failed request actually targeted.",
      err
    );
    return "Couldn't reach the sign-in service right now. This is a connection issue on our end, not your details — please try again shortly.";
  }
  return err?.message || "Something went wrong. Please try again.";
}
