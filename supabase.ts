
import { createClient } from '@supabase/supabase-js';

// Updated Supabase Credentials for Project: oxfqmqnxccfvsoiqzdwi
const supabaseUrl = 'https://oxfqmqnxccfvsoiqzdwi.supabase.co';
const supabaseAnonKey = 'sb_publishable_inBQ7JacSG0IHETkUEgnCA_pQITXtom';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
