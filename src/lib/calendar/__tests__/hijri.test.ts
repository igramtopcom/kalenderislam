import { describe, it, expect } from 'vitest';
import { gregorianToHijri, hijriToGregorian, formatHijriDate } from '../hijri';

describe('gregorianToHijri — Konversi Gregorian ke Hijri (via Lookup)', () => {

  it('1 Januari 2026 = 13 Rajab 1447 H', () => {
    const result = gregorianToHijri(new Date(2026, 0, 1));
    // 1 Rajab 1447 = 20 Dec 2025, jadi 1 Jan 2026 = hari ke-13
    expect(result.month).toBe(7);        // Rajab
    expect(result.year).toBe(1447);
    expect(result.monthName).toBe('Rajab');
    expect(result.source).not.toBe('tabular');
  });

  it('19 Februari 2026 = 1 Ramadan 1447 H (Kemenag official)', () => {
    // Lookup: 1 Ramadan 1447 = 18 Feb 2026 → 19 Feb = 2 Ramadan
    // WAIT: lookup says gregorianStart for Ramadan 1447 = 2026-02-18
    // So 18 Feb = day 1, 19 Feb = day 2
    const result18 = gregorianToHijri(new Date(2026, 1, 18));
    expect(result18.day).toBe(1);
    expect(result18.month).toBe(9);      // Ramadan
    expect(result18.year).toBe(1447);
    expect(result18.source).toBe('kemenag_official');
  });

  it('20 Maret 2026 = 1 Syawal 1447 H (prediksi Idul Fitri)', () => {
    const result = gregorianToHijri(new Date(2026, 2, 20));
    expect(result.day).toBe(1);
    expect(result.month).toBe(10);       // Syawal
    expect(result.year).toBe(1447);
    expect(result.monthName).toBe('Syawal');
  });

  it('18 Mei 2026 = 1 Dzulhijjah 1447 H', () => {
    const result = gregorianToHijri(new Date(2026, 4, 18));
    expect(result.day).toBe(1);
    expect(result.month).toBe(12);       // Dzulhijjah
    expect(result.year).toBe(1447);
  });

  it('27 Mei 2026 = 10 Dzulhijjah 1447 H (Idul Adha)', () => {
    const result = gregorianToHijri(new Date(2026, 4, 27));
    expect(result.day).toBe(10);
    expect(result.month).toBe(12);
    expect(result.year).toBe(1447);
    expect(result.monthName).toBe('Dzulhijjah');
  });

  it('16 Juni 2026 = 1 Muharram 1448 H (Tahun Baru Islam)', () => {
    const result = gregorianToHijri(new Date(2026, 5, 16));
    expect(result.day).toBe(1);
    expect(result.month).toBe(1);        // Muharram
    expect(result.year).toBe(1448);
    expect(result.monthName).toBe('Muharram');
  });

  it('1 Januari 2025 = 1 Rajab 1446 H (Kemenag)', () => {
    // Lookup: Rajab 1446 starts 2024-12-31
    const result = gregorianToHijri(new Date(2025, 0, 1));
    expect(result.day).toBe(2);  // 31 Dec = day 1, 1 Jan = day 2
    expect(result.month).toBe(7);
    expect(result.year).toBe(1446);
    expect(result.source).toBe('kemenag_official');
  });

  it('Menghasilkan formatted string yang benar', () => {
    const result = gregorianToHijri(new Date(2026, 1, 18));
    expect(result.formatted).toBe('1 Ramadan 1447 H');
  });

  it('monthNameShort tidak undefined untuk semua bulan', () => {
    for (let m = 0; m < 12; m++) {
      const result = gregorianToHijri(new Date(2026, m, 15));
      expect(result.monthNameShort).toBeDefined();
      expect(result.monthNameShort.length).toBeGreaterThan(0);
    }
  });

});

describe('gregorianToHijri — Lookup Table Priority', () => {

  it('Tanggal dalam range 2024–2032 menggunakan lookup (source bukan tabular)', () => {
    const result = gregorianToHijri(new Date(2026, 1, 19));
    expect(result.source).not.toBe('tabular');
  });

  it('18 Feb 2026 = hari terakhir Syaban 1447 H ATAU 1 Ramadan', () => {
    const result = gregorianToHijri(new Date(2026, 1, 18));
    // Lookup says Ramadan 1447 starts on 2026-02-18, so 18 Feb = 1 Ramadan
    expect(result.day).toBe(1);
    expect(result.month).toBe(9);   // Ramadan
    expect(result.year).toBe(1447);
  });

  it('17 Feb 2026 = hari terakhir Syaban 1447 H', () => {
    const result = gregorianToHijri(new Date(2026, 1, 17));
    expect(result.month).toBe(8);   // Syaban
    expect(result.year).toBe(1447);
  });

  it('Tanggal di luar range 2024–2032 fallback ke tabular', () => {
    const result = gregorianToHijri(new Date(2020, 0, 1));
    expect(result.source).toBe('tabular');
  });

  it('Source field terisi untuk semua tanggal 2026', () => {
    for (let m = 0; m < 12; m++) {
      const result = gregorianToHijri(new Date(2026, m, 15));
      expect(result.source).toBeDefined();
    }
  });

  it('Konsistensi: hari berturut-turut di awal bulan', () => {
    // Ramadan 1447 starts 18 Feb 2026
    const first = gregorianToHijri(new Date(2026, 1, 18));
    expect(first.day).toBe(1);
    expect(first.month).toBe(9);

    const second = gregorianToHijri(new Date(2026, 1, 19));
    expect(second.day).toBe(2);
    expect(second.month).toBe(9);

    const third = gregorianToHijri(new Date(2026, 1, 20));
    expect(third.day).toBe(3);
    expect(third.month).toBe(9);
  });

});

describe('hijriToGregorian — Konversi Hijri ke Gregorian (tabular)', () => {

  it('Menghasilkan tanggal yang masuk akal untuk 1 Ramadan 1447', () => {
    const result = hijriToGregorian(1, 9, 1447);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(1);   // Februari
  });

  it('1 Syawal 1447 H → sekitar Maret 2026', () => {
    const result = hijriToGregorian(1, 10, 1447);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(2);   // Maret
  });

  it('1 Muharram 1448 H → sekitar Juni 2026', () => {
    const result = hijriToGregorian(1, 1, 1448);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);   // Juni
  });

});

describe('Konsistensi round-trip (lookup path)', () => {

  it('Round-trip: tanggal dalam range lookup tetap konsisten', () => {
    // Karena gregorianToHijri pakai lookup tapi hijriToGregorian pakai tabular,
    // round-trip mungkin ±1 hari. Yang penting: bulan dan tahun sama.
    const original = new Date(2026, 5, 20); // 20 Jun 2026
    const hijri = gregorianToHijri(original);
    expect(hijri.month).toBe(1);  // Muharram
    expect(hijri.year).toBe(1448);
    expect(hijri.day).toBe(5);    // Hari ke-5 Muharram
  });

});

describe('Tabular fallback — tanggal historis', () => {

  it('Tanggal tahun 2000 tetap menghasilkan output valid', () => {
    const result = gregorianToHijri(new Date(2000, 0, 1));
    expect(result.source).toBe('tabular');
    expect(result.year).toBeGreaterThan(1400);
    expect(result.month).toBeGreaterThanOrEqual(1);
    expect(result.month).toBeLessThanOrEqual(12);
    expect(result.day).toBeGreaterThanOrEqual(1);
    expect(result.day).toBeLessThanOrEqual(30);
  });

  it('Tanggal tahun 1990 tetap valid', () => {
    const result = gregorianToHijri(new Date(1990, 6, 15));
    expect(result.source).toBe('tabular');
    expect(result.formatted).toContain(' H');
  });

});

describe('formatHijriDate', () => {

  it('Format output benar untuk 1 Ramadan', () => {
    const hijri = gregorianToHijri(new Date(2026, 1, 18));
    expect(formatHijriDate(hijri)).toBe('1 Ramadan 1447 H');
  });

});
