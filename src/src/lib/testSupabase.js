 // src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hfaddngnpreoolhuibuq.supabase.co'

const supabasePublishableKey =
  'sb_publishable_lKT40SwORQbT-DrCjVIkDA_j3tGfMX2'

console.log('Supabase URL carregada:', supabaseUrl)
console.log(
  'Supabase key carregada:',
  supabasePublishableKey ? 'SIM' : 'NÃO'
)

export const supabase = createClient(supabaseUrl, supabasePublishableKey)