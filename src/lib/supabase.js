 import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://hfaddngnpreoolhuibuq.supabase.co'

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_lKT40SwORQbT-DrCjVIkDA_j3tGfMX2'

console.log('Supabase URL carregada:', supabaseUrl)
console.log('Supabase key carregada:', supabasePublishableKey ? 'SIM' : 'NÃO')

export const supabase = createClient(supabaseUrl, supabasePublishableKey)