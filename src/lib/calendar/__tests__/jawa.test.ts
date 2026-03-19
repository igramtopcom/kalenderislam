import { describe, it, expect } from 'vitest';
import { gregorianToJawa, PASARAN, HARI_JAWA, NEPTU_HARI, NEPTU_PASARAN, getNeptuMeaning, getMonthJawa } from '../jawa';

describe('gregorianToJawa — Konversi Gregorian ke Kalender Jawa', () => {

  it('17 Agustus 1945 = Jumat Legi (fakta historis kemerdekaan RI)', () => {
    const result = gregorianToJawa(new Date(1945, 7, 17));
    expect(result.hariJawa).toBe('Jumah');
    expect(result.pasaran).toBe('Legi');
    expect(result.weton).toBe('Jumah Legi');
    expect(result.neptu).toBe(11); // Jumah(6) + Legi(5) = 11
  });

  it('Epoch 15 Maret 1633 menghasilkan pasaran Legi (kalibrasi Julian→Gregorian)', () => {
    const result = gregorianToJawa(new Date(1633, 2, 15));
    expect(result.pasaran).toBe('Legi');
  });

  it('Epoch+1 hari = pasaran berikutnya (Pahing)', () => {
    const result = gregorianToJawa(new Date(1633, 2, 16));
    expect(result.pasaran).toBe('Pahing');
  });

  it('Epoch+5 hari = kembali ke pasaran yang sama (siklus 5 hari)', () => {
    const epoch = gregorianToJawa(new Date(1633, 2, 15));
    const plus5 = gregorianToJawa(new Date(1633, 2, 20));
    expect(plus5.pasaran).toBe(epoch.pasaran);
  });

  it('1 Januari 2026 = Kemis Pon', () => {
    const result = gregorianToJawa(new Date(2026, 0, 1));
    expect(result.hariJawa).toBe('Kemis');
    expect(result.pasaran).toBe('Pon');
    expect(result.neptu).toBe(15); // Kemis(8) + Pon(7) = 15
  });

  it('17 Agustus 2025 = Ahad', () => {
    const result = gregorianToJawa(new Date(2025, 7, 17));
    expect(result.hariJawa).toBe('Ahad');
    expect(result.neptu).toBe(5 + NEPTU_PASARAN[result.pasaranIndex]);
  });

  it('Hari Jumat Kliwon memiliki neptu 14', () => {
    let found = false;
    for (let d = 0; d < 35; d++) {
      const date = new Date(2026, 0, 1 + d);
      const result = gregorianToJawa(date);
      if (result.hariJawa === 'Jumah' && result.pasaran === 'Kliwon') {
        expect(result.neptu).toBe(14); // Jumah(6) + Kliwon(8)
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it('Siklus 35 hari berulang dengan benar', () => {
    const date1 = new Date(2026, 0, 1);
    const date2 = new Date(2026, 1, 5); // +35 hari
    const result1 = gregorianToJawa(date1);
    const result2 = gregorianToJawa(date2);
    expect(result1.weton).toBe(result2.weton);
  });

  it('Neptu selalu dalam range 7–18', () => {
    for (let d = 0; d < 35; d++) {
      const date = new Date(2026, 0, 1 + d);
      const result = gregorianToJawa(date);
      expect(result.neptu).toBeGreaterThanOrEqual(7);
      expect(result.neptu).toBeLessThanOrEqual(18);
    }
  });

  it('Semua field terisi dengan benar', () => {
    const result = gregorianToJawa(new Date(2026, 1, 19));
    expect(result.pasaran).toBeDefined();
    expect(result.hariJawa).toBeDefined();
    expect(result.neptu).toBeDefined();
    expect(result.weton).toContain(result.hariJawa);
    expect(result.weton).toContain(result.pasaran);
    expect(result.neptusFormatted).toContain('Neptu');
    expect(result.pasaranIndex).toBeGreaterThanOrEqual(0);
    expect(result.pasaranIndex).toBeLessThanOrEqual(4);
    expect(result.hariJawaIndex).toBeGreaterThanOrEqual(0);
    expect(result.hariJawaIndex).toBeLessThanOrEqual(6);
  });

  it('35 hari menghasilkan 35 kombinasi weton unik', () => {
    const wetons = new Set<string>();
    for (let d = 0; d < 35; d++) {
      const result = gregorianToJawa(new Date(2026, 0, 1 + d));
      wetons.add(result.weton);
    }
    expect(wetons.size).toBe(35);
  });

});

describe('Validasi konstanta', () => {

  it('PASARAN berisi tepat 5 elemen', () => {
    expect(PASARAN.length).toBe(5);
    expect(PASARAN).toContain('Kliwon');
    expect(PASARAN).toContain('Legi');
    expect(PASARAN).toContain('Pahing');
    expect(PASARAN).toContain('Pon');
    expect(PASARAN).toContain('Wage');
  });

  it('HARI_JAWA berisi tepat 7 elemen', () => {
    expect(HARI_JAWA.length).toBe(7);
  });

  it('Neptu hari + pasaran range benar', () => {
    const hariValues = Object.values(NEPTU_HARI);
    const pasarValues = Object.values(NEPTU_PASARAN);
    const min = Math.min(...hariValues) + Math.min(...pasarValues);
    const max = Math.max(...hariValues) + Math.max(...pasarValues);
    expect(min).toBe(7);   // Selasa(3) + Wage(4) = 7
    expect(max).toBe(18);  // Setu(9) + Pahing(9) = 18
  });

});

describe('getNeptuMeaning', () => {

  it('Neptu 14 = Jumat Kliwon meaning', () => {
    expect(getNeptuMeaning(14)).toContain('Jumat Kliwon');
  });

  it('Neptu di luar range menghasilkan fallback', () => {
    expect(getNeptuMeaning(99)).toBe('Penuh potensi');
  });

});

describe('getMonthJawa', () => {

  it('Januari 2026 menghasilkan 31 hari', () => {
    const result = getMonthJawa(2026, 0);
    expect(result.length).toBe(31);
  });

  it('Februari 2026 menghasilkan 28 hari', () => {
    const result = getMonthJawa(2026, 1);
    expect(result.length).toBe(28);
  });

});
