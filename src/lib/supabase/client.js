import { createBrowserClient } from "@supabase/ssr";

let supabaseClient;

export function createSupabaseBrowserClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase environment variables are missing."
    );
  }

  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      supabaseUrl,
      supabaseAnonKey
    );
  }

  return supabaseClient;
}