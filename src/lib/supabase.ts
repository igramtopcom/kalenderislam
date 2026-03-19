import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OfficialDate {
  id: string;
  event: string;
  tahun_masehi: number;
  tanggal_resmi: string | null;
  tanggal_muhammadiyah: string | null;
  tanggal_perkiraan: string | null;
  catatan: string | null;
  updated_at: string;
}

export interface NationalHolidayRow {
  tanggal: string;
  nama: string;
  tipe: 'libur_nasional' | 'cuti_bersama';
  agama: 'islam' | 'kristen' | 'hindu' | 'nasional' | null;
  created_at: string;
}

// ─── Query Functions (server-side only) ──────────────────────────────────────

/**
 * Get official dates from Kemenag for a specific year
 * Used at build time (getStaticPaths) to show official vs estimated dates
 */
export async function getKemenagOfficialDates(year: number): Promise<OfficialDate[]> {
  if (!supabaseUrl || !supabaseKey) return [];

  const { data, error } = await supabase
    .from('official_dates')
    .select('*')
    .eq('tahun_masehi', year);

  if (error) {
    console.error('Error fetching official_dates:', error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Get official date for a specific event and year
 */
export async function getOfficialDate(event: string, year: number): Promise<OfficialDate | null> {
  if (!supabaseUrl || !supabaseKey) return null;

  const { data, error } = await supabase
    .from('official_dates')
    .select('*')
    .eq('event', event)
    .eq('tahun_masehi', year)
    .single();

  if (error) return null;
  return data;
}

/**
 * Get national holidays from Supabase for a specific year
 * Falls back to local seed data if Supabase is unavailable
 */
export async function getSupabaseHolidays(year: number): Promise<NationalHolidayRow[]> {
  if (!supabaseUrl || !supabaseKey) return [];

  const { data, error } = await supabase
    .from('national_holidays')
    .select('*')
    .gte('tanggal', `${year}-01-01`)
    .lte('tanggal', `${year}-12-31`)
    .order('tanggal');

  if (error) {
    console.error('Error fetching national_holidays:', error.message);
    return [];
  }
  return data ?? [];
}
