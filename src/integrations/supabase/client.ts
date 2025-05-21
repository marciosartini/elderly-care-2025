
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://pzpkcmqegpzprgrrmcdr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cGtjbXFlZ3B6cHJncnJtY2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3ODE1MjUsImV4cCI6MjA2MzM1NzUyNX0.E8mbH43qRTUYBxCuoE1-kGDD9I4rabAoD2HCU4rUTME";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// We moved the cleanupAuthState function to auth/authUtils.ts
export { cleanupAuthState } from '@/contexts/auth/authUtils';
