import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Check if environment variables are defined before creating client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Anon Key must be defined')
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
