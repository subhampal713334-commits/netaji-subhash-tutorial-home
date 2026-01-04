
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxfqmqnxccfvsoiqzdwi.supabase.co';
const supabaseAnonKey = 'sb_publishable_inBQ7JacSG0IHETkUEgnCA_pQITXtom';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debug connection
supabase.from('students').select('count', { count: 'exact', head: true }).then(({ error }) => {
  if (error) console.warn("Supabase initial connection check failed. This is likely RLS related:", error.message);
  else console.log("Supabase connected successfully.");
});
