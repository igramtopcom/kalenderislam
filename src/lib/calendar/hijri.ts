export const HIJRI_MONTHS = [
  'Muharram', 'Safar', 'Rabiul Awal', 'Rabiul Akhir',
  'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban',
  'Ramadan', 'Syawal', 'Dzulqaidah', 'Dzulhijjah',
] as const;

export const HIJRI_MONTHS_SHORT = [
  'Muh', 'Saf', 'R.Awal', 'R.Akhir',
  'J.Awal', 'J.Akhir', 'Raj', 'Sya',
  'Ram', 'Syw', 'Dzulq', 'Dzulh',
] as const;

export interface HijriDate {
  day: number;
  month: number;          // 1–12
  year: number;
  monthName: string;      // 'Muharram', 'Safar', ...
  monthNameShort: string; // 'Muh', 'Saf', ...
  formatted: string;      // '12 Rajab 1447 H'
}

/**
 * Konversi tanggal Gregorian ke Hijri (metode Umm al-Qura)
 * @param date - Objek Date JavaScript
 * @returns HijriDate
 */
export function gregorianToHijri(date: Date): HijriDate {
  const jdn = toJulianDayNumber(date);
  const l   = jdn - 1948440 + 10632;
  const n   = Math.floor((l - 1) / 10631);
  const l2  = l - 10631 * n + 354;
  const j   = Math.floor((10985 - l2) / 5316) *
              Math.floor(50 * l2 / 17719) +
              Math.floor(l2 / 5670) *
              Math.floor(43 * l2 / 15238);
  const l3  = l2 - Math.floor((30 - j) / 15) *
              Math.floor(17719 * j / 50) -
              Math.floor(j / 16) *
              Math.floor(15238 * j / 43) + 29;
  const month = Math.floor(24 * l3 / 709);
  const day   = l3 - Math.floor(709 * month / 24);
  const year  = 30 * n + j - 30;

  const monthName      = HIJRI_MONTHS[month - 1];
  const monthNameShort = HIJRI_MONTHS_SHORT[month - 1];

  return {
    day,
    month,
    year,
    monthName,
    monthNameShort,
    formatted: `${day} ${monthName} ${year} H`,
  };
}

/**
 * Konversi tanggal Hijri ke Gregorian (invers Umm al-Qura)
 * @param day - Hari Hijri (1–30)
 * @param month - Bulan Hijri (1–12)
 * @param year - Tahun Hijri
 * @returns Date JavaScript
 */
export function hijriToGregorian(day: number, month: number, year: number): Date {
  const jdn = Math.floor((11 * year + 3) / 30) +
              354 * year +
              30 * month -
              Math.floor((month - 1) / 2) +
              day + 1948440 - 385;

  return julianDayToDate(jdn);
}

/**
 * Mendapatkan semua tanggal dalam satu bulan Hijri
 * @param hijriYear - Tahun Hijri
 * @param hijriMonth - Bulan Hijri (1–12)
 * @returns Array of Date objects untuk bulan tersebut
 */
export function getHijriMonthDates(hijriYear: number, hijriMonth: number): Date[] {
  const dates: Date[] = [];
  for (let day = 1; day <= 30; day++) {
    const date = hijriToGregorian(day, hijriMonth, hijriYear);
    const check = gregorianToHijri(date);
    if (check.month !== hijriMonth || check.year !== hijriYear) break;
    dates.push(date);
  }
  return dates;
}

/**
 * Format tanggal Hijri ke string Indonesia
 * @param hijri - HijriDate object
 * @returns string, contoh: "12 Rajab 1447 H"
 */
export function formatHijriDate(hijri: HijriDate): string {
  return `${hijri.day} ${hijri.monthName} ${hijri.year} H`;
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

function toJulianDayNumber(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045;
}

function julianDayToDate(jdn: number): Date {
  const l = jdn + 68569;
  const n = Math.floor(4 * l / 146097);
  const l2 = l - Math.floor((146097 * n + 3) / 4);
  const i = Math.floor(4000 * (l2 + 1) / 1461001);
  const l3 = l2 - Math.floor(1461 * i / 4) + 31;
  const j = Math.floor(80 * l3 / 2447);
  const day = l3 - Math.floor(2447 * j / 80);
  const l4 = Math.floor(j / 11);
  const month = j + 2 - 12 * l4;
  const year = 100 * (n - 49) + i + l4;
  // Gunakan UTC noon untuk menghindari masalah DST
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}
