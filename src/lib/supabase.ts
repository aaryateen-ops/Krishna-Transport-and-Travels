import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const adminPassword = process.env.ADMIN_PASSWORD || 'krishna@admin2026';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Public client for inserts (RLS allows anyone to insert)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend Server Actions (bypasses RLS read/write blocks using custom header)
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'x-admin-key': adminPassword || '',
    },
  },
});
