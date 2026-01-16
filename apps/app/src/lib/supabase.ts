import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a lazy-initialized supabase client
// This handles SSR where env vars may not be available on server
let supabaseClient: SupabaseClient<Database> | null = null

export const getSupabase = () => {
  if (!supabaseClient) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables')
    }
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Export a proxy that lazily initializes the client when used
// This ensures the client is only created when needed (on the client side)
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop) {
    const client = getSupabase()
    const value = client[prop as keyof SupabaseClient<Database>]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  },
})
