
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxfqmqnxccfvsoiqzdwi.supabase.co';
const supabaseAnonKey = 'sb_publishable_inBQ7JacSG0IHETkUEgnCA_pQITXtom';

/**
 * FIX FOR 'RECORD NOT FOUND':
 * If you enabled RLS, you MUST run this SQL in your Supabase SQL Editor 
 * to allow the app to read the data:
 * 
 * -- Enable RLS
 * ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
 * ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create Read Policies (Fixes the 'not found' error)
 * CREATE POLICY "Public Read Students" ON public.students FOR SELECT TO anon USING (true);
 * CREATE POLICY "Public Read Schedules" ON public.schedules FOR SELECT TO anon USING (true);
 * CREATE POLICY "Public Read Materials" ON public.materials FOR SELECT TO anon USING (true);
 * CREATE POLICY "Public Read Classes" ON public.classes FOR SELECT TO anon USING (true);
 * 
 * -- Create Signup Policy
 * CREATE POLICY "Public Signup" ON public.students FOR INSERT TO anon WITH CHECK (true);
 */

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase credentials are missing!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
