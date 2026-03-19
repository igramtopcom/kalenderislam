// SERVER-SIDE ONLY — jangan import dari Islands/TSX

import { supabase } from './supabase';
import type {
  OfficialDate,
  OfficialDateEvent,
  NationalHoliday,
  ProcessedOfficialDate,
} from './types';

// ─── Official Dates ──────────────────────────────────────────────────────────

/**
 * Mendapatkan semua tanggal resmi untuk satu tahun
 */
export async function getKemenagOfficialDates(
  tahun: number
): Promise<ProcessedOfficialDate[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('official_dates')
    .select('*')
    .eq('tahun_masehi', tahun)
    .order('event');

  if (error) {
    console.error(`[Supabase] getKemenagOfficialDates(${tahun}):`, error.message);
    return [];
  }

  return (data as OfficialDate[]).map(processOfficialDate);
}

/**
 * Mendapatkan tanggal resmi untuk satu event tertentu
 */
export async function getOfficialDateByEvent(
  event: OfficialDateEvent,
  tahun: number
): Promise<ProcessedOfficialDate | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('official_dates')
    .select('*')
    .eq('event', event)
    .eq('tahun_masehi', tahun)
    .single();

  if (error || !data) return null;

  return processOfficialDate(data as OfficialDate);
}

/**
 * Memproses raw OfficialDate → format siap tampil
 * Prioritas: resmi > muhammadiyah > perkiraan
 */
function processOfficialDate(row: OfficialDate): ProcessedOfficialDate {
  const isConfirmed = row.tanggal_resmi !== null;

  let bestDate: string | null = null;
  let source: ProcessedOfficialDate['source'] = 'perkiraan';

  if (row.tanggal_resmi) {
    bestDate = row.tanggal_resmi;
    source   = 'kemenag_official';
  } else if (row.tanggal_muhammadiyah) {
    bestDate = row.tanggal_muhammadiyah;
    source   = 'muhammadiyah';
  } else if (row.tanggal_perkiraan) {
    bestDate = row.tanggal_perkiraan;
    source   = 'perkiraan';
  }

  return {
    event:                row.event as OfficialDateEvent,
    tahun_masehi:         row.tahun_masehi,
    bestDate,
    tanggal_resmi:        row.tanggal_resmi,
    tanggal_muhammadiyah: row.tanggal_muhammadiyah,
    tanggal_perkiraan:    row.tanggal_perkiraan,
    isConfirmed,
    source,
    catatan:              row.catatan,
  };
}

// ─── National Holidays ───────────────────────────────────────────────────────

/**
 * Mendapatkan semua hari libur untuk satu tahun dari Supabase
 */
export async function getNationalHolidaysFromDB(
  tahun: number
): Promise<NationalHoliday[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('national_holidays')
    .select('*')
    .gte('tanggal', `${tahun}-01-01`)
    .lte('tanggal', `${tahun}-12-31`)
    .order('tanggal');

  if (error) {
    console.error(`[Supabase] getNationalHolidaysFromDB(${tahun}):`, error.message);
    return [];
  }

  return data as NationalHoliday[];
}

/**
 * Mendapatkan hari libur untuk tanggal tertentu
 */
export async function getHolidayByDateFromDB(
  dateStr: string
): Promise<NationalHoliday | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('national_holidays')
    .select('*')
    .eq('tanggal', dateStr)
    .single();

  if (error || !data) return null;
  return data as NationalHoliday;
}

/**
 * Map tanggal → NationalHoliday untuk lookup O(1) di calendar grid
 */
export async function getHolidayMapForYear(
  tahun: number
): Promise<Map<string, NationalHoliday>> {
  const holidays = await getNationalHolidaysFromDB(tahun);
  const map = new Map<string, NationalHoliday>();
  for (const h of holidays) {
    map.set(h.tanggal, h);
  }
  return map;
}

// ─── Fallback Helper ─────────────────────────────────────────────────────────

/**
 * Supabase dulu, fallback ke data lokal jika gagal
 * Memastikan website tetap berfungsi saat Supabase down
 */
export async function getNationalHolidaysSafe(
  tahun: number
): Promise<NationalHoliday[]> {
  try {
    const dbData = await getNationalHolidaysFromDB(tahun);
    if (dbData.length > 0) return dbData;

    // Fallback ke seed lokal
    const { getNationalHolidays } = await import('./calendar/holidays');
    const localData = getNationalHolidays(tahun);
    return localData.map(h => ({
      tanggal:    h.tanggal,
      nama:       h.nama,
      tipe:       h.tipe,
      agama:      h.agama,
      created_at: new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}
