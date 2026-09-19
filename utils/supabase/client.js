import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Catches an obviously-malformed value (missing protocol, stray
// whitespace mid-string, wrong var pasted in) immediately in the
// browser console, rather than waiting for a cryptic "Failed to
// fetch" the first time someone submits a form.
if (typeof window !== "undefined" && supabaseUrl && !/^https:\/\/[^\s]+$/.test(supabaseUrl)) {
  console.error("NEXT_PUBLIC_SUPABASE_URL does not look like a valid https URL:", JSON.stringify(supabaseUrl));
}

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);
