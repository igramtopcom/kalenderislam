// PENTING: File ini HANYA boleh diimport dari server-side code
// (file .astro atau API routes) — JANGAN import dari Islands/TSX

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
