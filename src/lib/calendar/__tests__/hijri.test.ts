import { describe, it, expect } from 'vitest';
import { gregorianToHijri, hijriToGregorian, formatHijriDate } from '../hijri';

// CATATAN: Algoritma tabular Hijri adalah aproksimasi matematika dari kalender
// Umm al-Qura. Hasil bisa berbeda ±1-2 hari dari tanggal resmi Kemenag RI.
// Untuk tanggal resmi (sidang isbat), gunakan data dari Supabase official_dates.

describe('gregorianToHijri — Konversi Gregorian ke Hijri', () => {

  it('1 Januari 2026 = 12 Rajab 1447 H', () => {
    const result = gregorianToHijri(new Date(2026, 0, 1));
    expect(result.day).toBe(12);
    expect(result.month).toBe(7);        // Rajab = bulan ke-7
    expect(result.year).toBe(1447);
    expect(result.monthName).toBe('Rajab');
  });

  it('18 Februari 2026 = 1 Ramadan 1447 H', () => {
    const result = gregorianToHijri(new Date(2026, 1, 18));
    expect(result.day).toBe(1);
    expect(result.month).toBe(9);        // Ramadan = bulan ke-9
    expect(result.year).toBe(1447);
    expect(result.monthName).toBe('Ramadan');
  });

  it('19 Februari 2026 = 2 Ramadan 1447 H', () => {
    const result = gregorianToHijri(new Date(2026, 1, 19));
    expect(result.day).toBe(2);
    expect(result.month).toBe(9);
    expect(result.year).toBe(1447);
    expect(result.monthNameShort).toBe('Ram');
  });

  it('20 Maret 2026 = 1 Syawal 1447 H (prediksi Idul Fitri)', () => {
    const result = gregorianToHijri(new Date(2026, 2, 20));
    expect(result.day).toBe(1);
    expect(result.month).toBe(10);       // Syawal = bulan ke-10
    expect(result.year).toBe(1447);
    expect(result.monthName).toBe('Syawal');
  });

  it('27 Mei 2026 = 10 Dzulhijjah 1447 H (Idul Adha)', () => {
    const result = gregorianToHijri(new Date(2026, 4, 27));
    expect(result.day).toBe(10);
    expect(result.month).toBe(12);       // Dzulhijjah = bulan ke-12
    expect(result.year).toBe(1447);
    expect(result.monthName).toBe('Dzulhijjah');
  });

  it('17 Juni 2026 = 1 Muharram 1448 H (Tahun Baru Islam)', () => {
    const result = gregorianToHijri(new Date(2026, 5, 17));
    expect(result.day).toBe(1);
    expect(result.month).toBe(1);        // Muharram = bulan ke-1
    expect(result.year).toBe(1448);
    expect(result.monthName).toBe('Muharram');
  });

  it('1 Januari 2025 = 1 Rajab 1446 H', () => {
    const result = gregorianToHijri(new Date(2025, 0, 1));
    expect(result.day).toBe(1);
    expect(result.month).toBe(7);
    expect(result.year).toBe(1446);
  });

  it('1 Januari 2030 = verifikasi tahun 1451 H', () => {
    const result = gregorianToHijri(new Date(2030, 0, 1));
    expect(result.year).toBe(1451);
  });

  it('Menghasilkan formatted string yang benar', () => {
    const result = gregorianToHijri(new Date(2026, 0, 1));
    expect(result.formatted).toBe('12 Rajab 1447 H');
  });

  it('monthNameShort tidak undefined untuk semua bulan', () => {
    for (let m = 0; m < 12; m++) {
      const result = gregorianToHijri(new Date(2026, m, 15));
      expect(result.monthNameShort).toBeDefined();
      expect(result.monthNameShort.length).toBeGreaterThan(0);
    }
  });

});

describe('hijriToGregorian — Konversi Hijri ke Gregorian', () => {

  it('1 Ramadan 1447 H = 18 Februari 2026', () => {
    const result = hijriToGregorian(1, 9, 1447);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);   // Februari = 1 (0-indexed)
    expect(result.getDate()).toBe(18);
  });

  it('1 Syawal 1447 H = 20 Maret 2026', () => {
    const result = hijriToGregorian(1, 10, 1447);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);   // Maret = 2 (0-indexed)
    expect(result.getDate()).toBe(20);
  });

  it('1 Muharram 1448 H = 17 Juni 2026', () => {
    const result = hijriToGregorian(1, 1, 1448);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);   // Juni = 5 (0-indexed)
    expect(result.getDate()).toBe(17);
  });

});

describe('Konsistensi round-trip Gregorian → Hijri → Gregorian', () => {

  it('Round-trip akurat untuk 1 Januari 2026', () => {
    const original = new Date(2026, 0, 1);
    const hijri = gregorianToHijri(original);
    const back = hijriToGregorian(hijri.day, hijri.month, hijri.year);
    expect(back.getFullYear()).toBe(original.getFullYear());
    expect(back.getMonth()).toBe(original.getMonth());
    expect(back.getDate()).toBe(original.getDate());
  });

  it('Round-trip akurat untuk 17 Agustus 2025', () => {
    const original = new Date(2025, 7, 17);
    const hijri = gregorianToHijri(original);
    const back = hijriToGregorian(hijri.day, hijri.month, hijri.year);
    expect(back.getFullYear()).toBe(original.getFullYear());
    expect(back.getMonth()).toBe(original.getMonth());
    expect(back.getDate()).toBe(original.getDate());
  });

  it('Round-trip akurat untuk 1 Januari 2030', () => {
    const original = new Date(2030, 0, 1);
    const hijri = gregorianToHijri(original);
    const back = hijriToGregorian(hijri.day, hijri.month, hijri.year);
    expect(back.getFullYear()).toBe(original.getFullYear());
    expect(back.getMonth()).toBe(original.getMonth());
    expect(back.getDate()).toBe(original.getDate());
  });

  it('Round-trip akurat untuk 100 tanggal random', () => {
    const baseDate = new Date(2024, 0, 1).getTime();
    const range = 365 * 8 * 24 * 60 * 60 * 1000; // 8 tahun
    for (let i = 0; i < 100; i++) {
      const ms = baseDate + Math.floor((i / 100) * range);
      const original = new Date(ms);
      const hijri = gregorianToHijri(original);
      const back = hijriToGregorian(hijri.day, hijri.month, hijri.year);
      expect(back.getFullYear()).toBe(original.getFullYear());
      expect(back.getMonth()).toBe(original.getMonth());
      expect(back.getDate()).toBe(original.getDate());
    }
  });

});

describe('formatHijriDate', () => {

  it('Format output benar', () => {
    const hijri = gregorianToHijri(new Date(2026, 1, 18));
    expect(formatHijriDate(hijri)).toBe('1 Ramadan 1447 H');
  });

});
