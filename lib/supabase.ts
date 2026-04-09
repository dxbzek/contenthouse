import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — avoids calling createClient at module init time (which throws
// during the Next.js build when env vars are not yet injected by Vercel).
let _supabase: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return _supabase;
}
