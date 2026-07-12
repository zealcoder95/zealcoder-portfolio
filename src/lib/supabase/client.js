import { createBrowserClient } from "@supabase/ssr";

let browserClient;

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase browser environment variables are missing."
    );
  }

  if (!browserClient) {
    browserClient = createBrowserClient(
      url,
      anonKey
    );
  }

  return browserClient;
}
