import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL não foi configurada.')
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY não foi configurada.')
}

const storage =
  typeof window !== 'undefined'
    ? window.localStorage
    : undefined

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    storageKey: 'ebdfiel-auth-token',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})
