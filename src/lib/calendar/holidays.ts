// Sementara menggunakan data seed lokal
// Sprint S-03 akan mengganti ini dengan query Supabase

export interface Holiday {
  tanggal: string;       // format: 'YYYY-MM-DD'
  nama: string;
  tipe: 'libur_nasional' | 'cuti_bersama';
  agama: 'islam' | 'kristen' | 'hindu' | 'nasional' | null;
}

/**
 * Data hari libur nasional 2025–2027 (seed awal)
 * Sumber: SKB 3 Menteri (Menaker, Menpan, Menag)
 */
const HOLIDAYS_SEED: Holiday[] = [
  // 2025
  { tanggal: '2025-01-01', nama: 'Tahun Baru Masehi', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2025-01-27', nama: 'Isra Mi\'raj', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2025-01-28', nama: 'Cuti Bersama Isra Mi\'raj', tipe: 'cuti_bersama', agama: 'islam' },
  { tanggal: '2025-01-29', nama: 'Tahun Baru Imlek 2576', tipe: 'libur_nasional', agama: null },
  { tanggal: '2025-03-29', nama: 'Hari Suci Nyepi', tipe: 'libur_nasional', agama: 'hindu' },
  { tanggal: '2025-03-30', nama: 'Idul Fitri 1446 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2025-03-31', nama: 'Idul Fitri 1446 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2025-04-18', nama: 'Wafat Isa Al Masih', tipe: 'libur_nasional', agama: 'kristen' },
  { tanggal: '2025-05-01', nama: 'Hari Buruh Internasional', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2025-05-12', nama: 'Hari Raya Waisak', tipe: 'libur_nasional', agama: null },
  { tanggal: '2025-05-29', nama: 'Kenaikan Isa Al Masih', tipe: 'libur_nasional', agama: 'kristen' },
  { tanggal: '2025-06-01', nama: 'Hari Lahir Pancasila', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2025-06-06', nama: 'Idul Adha 1446 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2025-06-27', nama: 'Tahun Baru Islam 1447 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2025-08-17', nama: 'HUT RI ke-80', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2025-09-05', nama: 'Maulid Nabi Muhammad SAW', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2025-12-25', nama: 'Hari Raya Natal', tipe: 'libur_nasional', agama: 'kristen' },
  { tanggal: '2025-12-26', nama: 'Cuti Bersama Natal', tipe: 'cuti_bersama', agama: 'kristen' },

  // 2026
  { tanggal: '2026-01-01', nama: 'Tahun Baru Masehi', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2026-02-17', nama: 'Tahun Baru Imlek 2577', tipe: 'libur_nasional', agama: null },
  { tanggal: '2026-02-19', nama: 'Isra Mi\'raj 1447 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2026-03-19', nama: 'Hari Suci Nyepi', tipe: 'libur_nasional', agama: 'hindu' },
  { tanggal: '2026-03-20', nama: 'Idul Fitri 1447 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2026-03-21', nama: 'Idul Fitri 1447 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2026-03-22', nama: 'Cuti Bersama Idul Fitri', tipe: 'cuti_bersama', agama: 'islam' },
  { tanggal: '2026-04-03', nama: 'Wafat Isa Al Masih', tipe: 'libur_nasional', agama: 'kristen' },
  { tanggal: '2026-05-01', nama: 'Hari Buruh Internasional', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2026-05-14', nama: 'Kenaikan Isa Al Masih', tipe: 'libur_nasional', agama: 'kristen' },
  { tanggal: '2026-05-27', nama: 'Hari Raya Waisak', tipe: 'libur_nasional', agama: null },
  { tanggal: '2026-05-27', nama: 'Idul Adha 1447 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2026-06-01', nama: 'Hari Lahir Pancasila', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2026-06-16', nama: 'Tahun Baru Islam 1448 H', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2026-08-17', nama: 'HUT RI ke-81', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2026-08-25', nama: 'Maulid Nabi Muhammad SAW', tipe: 'libur_nasional', agama: 'islam' },
  { tanggal: '2026-12-25', nama: 'Hari Raya Natal', tipe: 'libur_nasional', agama: 'kristen' },

  // 2027 (perkiraan, akan diupdate setelah SKB terbit)
  { tanggal: '2027-01-01', nama: 'Tahun Baru Masehi', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2027-08-17', nama: 'HUT RI ke-82', tipe: 'libur_nasional', agama: 'nasional' },
  { tanggal: '2027-12-25', nama: 'Hari Raya Natal', tipe: 'libur_nasional', agama: 'kristen' },
];

/**
 * Mendapatkan semua hari libur untuk satu tahun
 */
export function getNationalHolidays(year: number): Holiday[] {
  return HOLIDAYS_SEED.filter(h => h.tanggal.startsWith(`${year}-`));
}

/**
 * Mendapatkan hari libur untuk tanggal tertentu
 */
export function getHolidayByDate(dateStr: string): Holiday | undefined {
  return HOLIDAYS_SEED.find(h => h.tanggal === dateStr);
}

/**
 * Cek apakah suatu tanggal adalah hari libur
 */
export function isHoliday(date: Date): boolean {
  const dateStr = formatDateKey(date);
  return HOLIDAYS_SEED.some(h => h.tanggal === dateStr);
}

/**
 * Format tanggal ke string 'YYYY-MM-DD'
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
