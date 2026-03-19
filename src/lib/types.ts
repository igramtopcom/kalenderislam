export interface Kota {
  slug: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  timezone: string;
  elevation: number;
}

export interface HariBesar {
  slug: string;
  nama: string;
  nama_arab: string;
  hijriMonth: number;
  hijriDay: number;
  libur_nasional: boolean;
  deskripsi: string;
  amalan: string[];
  event_id: string;
}

export interface Provinsi {
  slug: string;
  nama: string;
  kota_utama: string[];
}

export type HijriSource = 'kemenag_official' | 'umm_alqura_projection';

export interface HijriMonthEntry {
  hijriYear: number;
  hijriMonth: number;   // 1–12
  gregorianStart: string; // format: 'YYYY-MM-DD'
  source: HijriSource;
}

// ─── Supabase Table Types ────────────────────────────────────────────────────

export type OfficialDateEvent =
  | 'ramadan_start'
  | 'idul_fitri'
  | 'idul_adha'
  | 'isra_miraj'
  | 'maulid_nabi'
  | 'muharram'
  | 'nuzulul_quran'
  | 'lailatul_qadar'
  | 'hari_arafah';

export interface OfficialDate {
  id:                    string;
  event:                 OfficialDateEvent;
  tahun_masehi:          number;
  tanggal_resmi:         string | null;
  tanggal_muhammadiyah:  string | null;
  tanggal_perkiraan:     string | null;
  catatan:               string | null;
  updated_at:            string;
}

export interface NationalHoliday {
  tanggal:    string;   // 'YYYY-MM-DD'
  nama:       string;
  tipe:       'libur_nasional' | 'cuti_bersama';
  agama:      'islam' | 'kristen' | 'hindu' | 'nasional' | null;
  created_at: string;
}

export interface ProcessedOfficialDate {
  event:               OfficialDateEvent;
  tahun_masehi:        number;
  bestDate:            string | null;
  tanggal_resmi:       string | null;
  tanggal_muhammadiyah: string | null;
  tanggal_perkiraan:   string | null;
  isConfirmed:         boolean;
  source:              'kemenag_official' | 'muhammadiyah' | 'perkiraan';
  catatan:             string | null;
}

export interface PrayerMethod {
  id: string;
  nama: string;
  deskripsi: string;
  fajrAngle: number;
  ishaAngle: number;
  madhab: 'shafi' | 'hanafi';
  isDefault: boolean;
}
