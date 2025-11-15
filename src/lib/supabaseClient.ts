import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or anon key are missing from environment variables.');
}

// To prevent HMR from creating multiple instances of the Supabase client
const globalForSupabase = globalThis as any;

export const supabase =
  globalForSupabase.supabase ??
  createClient(supabaseUrl!, supabaseAnonKey!);

if (import.meta.env.DEV) {
  globalForSupabase.supabase = supabase;
}
