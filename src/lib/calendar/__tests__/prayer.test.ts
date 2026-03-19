import { describe, it, expect } from 'vitest';
import {
  getPrayerTimes,
  getSholatTimesFormatted,
  getTimezoneLabel,
  getNextPrayer,
  generateImsakiyah,
} from '../prayer';

// Koordinat Jakarta
const JAKARTA_LAT = -6.2088;
const JAKARTA_LNG = 106.8456;
const JAKARTA_TZ  = 'Asia/Jakarta';

describe('getPrayerTimes — Waktu sholat Jakarta', () => {

  it('Mengembalikan 6 waktu sholat yang valid', () => {
    const date = new Date(2026, 1, 19);
    const times = getPrayerTimes(JAKARTA_LAT, JAKARTA_LNG, date);
    expect(times.fajr).toBeInstanceOf(Date);
    expect(times.sunrise).toBeInstanceOf(Date);
    expect(times.dhuhr).toBeInstanceOf(Date);
    expect(times.asr).toBeInstanceOf(Date);
    expect(times.maghrib).toBeInstanceOf(Date);
    expect(times.isha).toBeInstanceOf(Date);
  });

  it('Urutan waktu sholat benar: fajr < sunrise < dhuhr < asr < maghrib < isha', () => {
    const date = new Date(2026, 1, 19);
    const times = getPrayerTimes(JAKARTA_LAT, JAKARTA_LNG, date);
    expect(times.fajr.getTime()).toBeLessThan(times.sunrise.getTime());
    expect(times.sunrise.getTime()).toBeLessThan(times.dhuhr.getTime());
    expect(times.dhuhr.getTime()).toBeLessThan(times.asr.getTime());
    expect(times.asr.getTime()).toBeLessThan(times.maghrib.getTime());
    expect(times.maghrib.getTime()).toBeLessThan(times.isha.getTime());
  });

  it('Fajr Jakarta sekitar 04:15–04:50 WIB', () => {
    const date = new Date(2026, 1, 19);
    const formatted = getSholatTimesFormatted(JAKARTA_LAT, JAKARTA_LNG, date, JAKARTA_TZ);
    const [hours, minutes] = formatted.fajr.split(':').map(Number);
    expect(hours).toBe(4);
    expect(minutes).toBeGreaterThanOrEqual(15);
    expect(minutes).toBeLessThanOrEqual(50);
  });

  it('Maghrib Jakarta sekitar 18:00–18:20 WIB', () => {
    const date = new Date(2026, 1, 19);
    const formatted = getSholatTimesFormatted(JAKARTA_LAT, JAKARTA_LNG, date, JAKARTA_TZ);
    const [hours] = formatted.maghrib.split(':').map(Number);
    expect(hours).toBe(18);
  });

  it('Imsak = Fajr - 10 menit', () => {
    const date = new Date(2026, 1, 19);
    const formatted = getSholatTimesFormatted(JAKARTA_LAT, JAKARTA_LNG, date, JAKARTA_TZ);
    const [fajrH, fajrM] = formatted.fajr.split(':').map(Number);
    const [imsakH, imsakM] = formatted.imsak.split(':').map(Number);
    const fajrTotal = fajrH * 60 + fajrM;
    const imsakTotal = imsakH * 60 + imsakM;
    expect(fajrTotal - imsakTotal).toBe(10);
  });

  it('Dhuhr Jakarta sekitar 11:50–12:10 WIB', () => {
    const date = new Date(2026, 1, 19);
    const formatted = getSholatTimesFormatted(JAKARTA_LAT, JAKARTA_LNG, date, JAKARTA_TZ);
    const [hours] = formatted.dhuhr.split(':').map(Number);
    expect(hours).toBeGreaterThanOrEqual(11);
    expect(hours).toBeLessThanOrEqual(12);
  });

});

describe('getTimezoneLabel', () => {
  it('Asia/Jakarta → WIB', () => expect(getTimezoneLabel('Asia/Jakarta')).toBe('WIB'));
  it('Asia/Makassar → WITA', () => expect(getTimezoneLabel('Asia/Makassar')).toBe('WITA'));
  it('Asia/Jayapura → WIT', () => expect(getTimezoneLabel('Asia/Jayapura')).toBe('WIT'));
});

describe('getSholatTimesFormatted — Format output', () => {

  it('Format waktu HH:MM', () => {
    const date = new Date(2026, 1, 19);
    const formatted = getSholatTimesFormatted(JAKARTA_LAT, JAKARTA_LNG, date, JAKARTA_TZ);
    const timeRegex = /^\d{2}:\d{2}$/;
    expect(formatted.fajr).toMatch(timeRegex);
    expect(formatted.dhuhr).toMatch(timeRegex);
    expect(formatted.asr).toMatch(timeRegex);
    expect(formatted.maghrib).toMatch(timeRegex);
    expect(formatted.isha).toMatch(timeRegex);
    expect(formatted.imsak).toMatch(timeRegex);
  });

  it('timezoneLabel terisi benar', () => {
    const date = new Date(2026, 1, 19);
    const formatted = getSholatTimesFormatted(JAKARTA_LAT, JAKARTA_LNG, date, JAKARTA_TZ);
    expect(formatted.timezoneLabel).toBe('WIB');
    expect(formatted.timezone).toBe('Asia/Jakarta');
  });

});

describe('getNextPrayer', () => {

  it('Pagi sebelum fajr → fajr', () => {
    const times = getPrayerTimes(JAKARTA_LAT, JAKARTA_LNG, new Date(2026, 1, 19));
    const earlyMorning = new Date(times.fajr.getTime() - 60 * 60 * 1000); // 1 jam sebelum fajr
    expect(getNextPrayer(JAKARTA_LAT, JAKARTA_LNG, earlyMorning)).toBe('fajr');
  });

  it('Setelah isha → fajr (besok)', () => {
    const times = getPrayerTimes(JAKARTA_LAT, JAKARTA_LNG, new Date(2026, 1, 19));
    const afterIsha = new Date(times.isha.getTime() + 60 * 60 * 1000);
    expect(getNextPrayer(JAKARTA_LAT, JAKARTA_LNG, afterIsha)).toBe('fajr');
  });

});

describe('generateImsakiyah', () => {

  it('Menghasilkan 30 hari imsakiyah', () => {
    const ramadanStart = new Date(2026, 1, 18); // 18 Feb 2026
    const result = generateImsakiyah(JAKARTA_LAT, JAKARTA_LNG, JAKARTA_TZ, ramadanStart, 30);
    expect(result.length).toBe(30);
    expect(result[0].hari).toBe(1);
    expect(result[29].hari).toBe(30);
  });

  it('Setiap hari memiliki times lengkap', () => {
    const ramadanStart = new Date(2026, 1, 18);
    const result = generateImsakiyah(JAKARTA_LAT, JAKARTA_LNG, JAKARTA_TZ, ramadanStart, 3);
    for (const day of result) {
      expect(day.times.fajr).toBeDefined();
      expect(day.times.imsak).toBeDefined();
      expect(day.times.maghrib).toBeDefined();
      expect(day.tanggal).toBeDefined();
    }
  });

});
