import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export interface SholatTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface SholatTimesFormatted {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  imsak: string;   // fajr - 10 menit (standar Kemenag)
  timezone: string;
  timezoneLabel: string; // 'WIB' | 'WITA' | 'WIT'
}

/**
 * Menghitung waktu sholat untuk koordinat dan tanggal tertentu
 * Menggunakan metode Kemenag Indonesia: Fajr 20°, Isha 18°, Mazhab Syafi'i
 */
export function getPrayerTimes(lat: number, lng: number, date: Date): SholatTimes {
  const coordinates = new Coordinates(lat, lng);

  const params = CalculationMethod.MuslimWorldLeague();
  params.fajrAngle = 20;
  params.ishaAngle = 18;
  params.madhab = Madhab.Shafi;

  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return {
    fajr:    prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr:   prayerTimes.dhuhr,
    asr:     prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha:    prayerTimes.isha,
  };
}

/**
 * Format waktu sholat ke string HH:MM dengan timezone lokal
 */
export function formatSholatTime(date: Date, timezone: string): string {
  const formatted = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
    hour12: false,
  });
  // Normalize separator: id-ID locale may use '.' instead of ':'
  return formatted.replace('.', ':');
}

/**
 * Mendapatkan label timezone (WIB/WITA/WIT) dari nama timezone IANA
 */
export function getTimezoneLabel(timezone: string): 'WIB' | 'WITA' | 'WIT' {
  if (timezone === 'Asia/Makassar') return 'WITA';
  if (timezone === 'Asia/Jayapura') return 'WIT';
  return 'WIB';
}

/**
 * Mendapatkan semua waktu sholat dalam format string siap tampil
 */
export function getSholatTimesFormatted(
  lat: number,
  lng: number,
  date: Date,
  timezone: string
): SholatTimesFormatted {
  const times = getPrayerTimes(lat, lng, date);

  // Imsak = Fajr - 10 menit (standar Kemenag)
  const imsakDate = new Date(times.fajr.getTime() - 10 * 60 * 1000);

  return {
    fajr:           formatSholatTime(times.fajr, timezone),
    sunrise:        formatSholatTime(times.sunrise, timezone),
    dhuhr:          formatSholatTime(times.dhuhr, timezone),
    asr:            formatSholatTime(times.asr, timezone),
    maghrib:        formatSholatTime(times.maghrib, timezone),
    isha:           formatSholatTime(times.isha, timezone),
    imsak:          formatSholatTime(imsakDate, timezone),
    timezone,
    timezoneLabel:  getTimezoneLabel(timezone),
  };
}

/**
 * Mendapatkan waktu sholat berikutnya dari waktu sekarang
 */
export function getNextPrayer(
  lat: number,
  lng: number,
  now: Date
): keyof SholatTimes {
  const times = getPrayerTimes(lat, lng, now);

  if (now < times.fajr)    return 'fajr';
  if (now < times.dhuhr)   return 'dhuhr';
  if (now < times.asr)     return 'asr';
  if (now < times.maghrib) return 'maghrib';
  if (now < times.isha)    return 'isha';
  return 'fajr';
}

/**
 * Generate jadwal imsakiyah untuk seluruh bulan Ramadan
 */
export function generateImsakiyah(
  lat: number,
  lng: number,
  timezone: string,
  ramadanStartDate: Date,
  totalDays: number = 30
): Array<{ hari: number; tanggal: string; times: SholatTimesFormatted }> {
  const result = [];

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(ramadanStartDate);
    date.setDate(date.getDate() + i);

    const times = getSholatTimesFormatted(lat, lng, date, timezone);
    const tanggal = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: timezone,
    });

    result.push({ hari: i + 1, tanggal, times });
  }

  return result;
}
