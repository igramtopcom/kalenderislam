// SERVER-SIDE ONLY — jangan import dari Islands/TSX

import { supabase } from './supabase';
import { hijriToGregorian } from './calendar/hijri';
import type {
  OfficialDate,
  OfficialDateEvent,
  NationalHoliday,
  ProcessedOfficialDate,
} from './types';

// ─── Algo Fallback for tanggal_perkiraan ─────────────────────────────────────

const EVENT_HIJRI: Record<string, { month: number; day: number }> = {
  'ramadan_start':  { month: 9,  day: 1  },
  'idul_fitri':     { month: 10, day: 1  },
  'idul_adha':      { month: 12, day: 10 },
  'muharram':       { month: 1,  day: 1  },
  'maulid_nabi':    { month: 3,  day: 12 },
  'isra_miraj':     { month: 7,  day: 27 },
  'nuzulul_quran':  { month: 9,  day: 17 },
  'lailatul_qadar': { month: 9,  day: 27 },
  'hari_arafah':    { month: 12, day: 9  },
};

function calcPerkiraanFromAlgo(event: string, tahun: number): string | null {
  const ref = EVENT_HIJRI[event];
  if (!ref) return null;

  const hijriYearEst = tahun - 579;
  for (const hy of [hijriYearEst, hijriYearEst + 1]) {
    try {
      const date = hijriToGregorian(ref.day, ref.month, hy);
      if (date.getFullYear() === tahun) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    } catch { continue; }
  }
  return null;
}

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
  }

  const rows = (data as OfficialDate[] | null) ?? [];
  if (rows.length > 0) return rows.map(processOfficialDate);

  // Fallback: generate from algorithm when Supabase unavailable/empty
  return generateFallbackOfficialDates(tahun);
}

/**
 * Mendapatkan tanggal resmi untuk satu event tertentu
 */
export async function getOfficialDateByEvent(
  event: OfficialDateEvent,
  tahun: number
): Promise<ProcessedOfficialDate | null> {
  if (supabase) {
    const { data } = await supabase
      .from('official_dates')
      .select('*')
      .eq('event', event)
      .eq('tahun_masehi', tahun)
      .single();

    if (data) return processOfficialDate(data as OfficialDate);
  }

  // Fallback: generate from algorithm
  const perkiraan = calcPerkiraanFromAlgo(event, tahun);
  if (!perkiraan) return null;

  return {
    event: event as OfficialDateEvent,
    tahun_masehi: tahun,
    bestDate: perkiraan,
    tanggal_resmi: null,
    tanggal_muhammadiyah: null,
    tanggal_perkiraan: perkiraan,
    isConfirmed: false,
    source: 'perkiraan',
    catatan: null,
  };
}

/**
 * Memproses raw OfficialDate → format siap tampil
 * Prioritas: resmi > muhammadiyah > perkiraan
 */
/**
 * Generate fallback official dates from algorithm when Supabase unavailable
 */
function generateFallbackOfficialDates(tahun: number): ProcessedOfficialDate[] {
  return Object.entries(EVENT_HIJRI)
    .map(([event, ref]) => {
      const perkiraan = calcPerkiraanFromAlgo(event, tahun);
      if (!perkiraan) return null;
      return {
        event: event as OfficialDateEvent,
        tahun_masehi: tahun,
        bestDate: perkiraan,
        tanggal_resmi: null,
        tanggal_muhammadiyah: null,
        tanggal_perkiraan: perkiraan,
        isConfirmed: false,
        source: 'perkiraan' as const,
        catatan: null,
      };
    })
    .filter((d): d is ProcessedOfficialDate => d !== null);
}

function processOfficialDate(row: OfficialDate): ProcessedOfficialDate {
  // Fallback: calculate tanggal_perkiraan from algorithm if Supabase NULL
  const tanggalPerkiraan =
    row.tanggal_perkiraan ??
    calcPerkiraanFromAlgo(row.event, row.tahun_masehi);

  const isConfirmed = row.tanggal_resmi !== null;

  let bestDate: string | null = null;
  let source: ProcessedOfficialDate['source'] = 'perkiraan';

  if (row.tanggal_resmi) {
    bestDate = row.tanggal_resmi;
    source   = 'kemenag_official';
  } else if (row.tanggal_muhammadiyah) {
    bestDate = row.tanggal_muhammadiyah;
    source   = 'muhammadiyah';
  } else if (tanggalPerkiraan) {
    bestDate = tanggalPerkiraan;
    source   = 'perkiraan';
  }

  return {
    event:                row.event as OfficialDateEvent,
    tahun_masehi:         row.tahun_masehi,
    bestDate,
    tanggal_resmi:        row.tanggal_resmi,
    tanggal_muhammadiyah: row.tanggal_muhammadiyah,
    tanggal_perkiraan:    tanggalPerkiraan,
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
