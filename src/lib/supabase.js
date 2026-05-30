import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL não foi configurada.')
}

if (!supabaseKey) {
  console.error('VITE_SUPABASE_PUBLISHABLE_KEY não foi configurada.')
}

const storage =
  typeof window !== 'undefined'
    ? window.localStorage
    : undefined

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage,
    storageKey: 'ebdfiel-auth-token',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
