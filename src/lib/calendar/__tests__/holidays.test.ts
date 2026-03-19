import { describe, it, expect } from 'vitest';
import { getNationalHolidays, getHolidayByDate, isHoliday, formatDateKey } from '../holidays';

describe('getNationalHolidays', () => {

  it('2025 memiliki 18 hari libur/cuti bersama', () => {
    const holidays = getNationalHolidays(2025);
    expect(holidays.length).toBe(18);
  });

  it('2026 memiliki >= 15 hari libur', () => {
    const holidays = getNationalHolidays(2026);
    expect(holidays.length).toBeGreaterThanOrEqual(15);
  });

  it('2027 memiliki data minimal (perkiraan)', () => {
    const holidays = getNationalHolidays(2027);
    expect(holidays.length).toBeGreaterThanOrEqual(3);
  });

  it('Tahun tanpa data menghasilkan array kosong', () => {
    const holidays = getNationalHolidays(2020);
    expect(holidays.length).toBe(0);
  });

});

describe('getHolidayByDate', () => {

  it('Idul Fitri 2026 ditemukan', () => {
    const holiday = getHolidayByDate('2026-03-20');
    expect(holiday).toBeDefined();
    expect(holiday!.nama).toContain('Idul Fitri');
    expect(holiday!.agama).toBe('islam');
  });

  it('Tanggal biasa mengembalikan undefined', () => {
    expect(getHolidayByDate('2026-04-15')).toBeUndefined();
  });

});

describe('isHoliday', () => {

  it('Idul Fitri 2026 = true', () => {
    expect(isHoliday(new Date(2026, 2, 20))).toBe(true);
  });

  it('17 Agustus 2026 = true', () => {
    expect(isHoliday(new Date(2026, 7, 17))).toBe(true);
  });

  it('Tanggal biasa = false', () => {
    expect(isHoliday(new Date(2026, 3, 15))).toBe(false);
  });

});

describe('formatDateKey', () => {

  it('Format benar dengan padding', () => {
    expect(formatDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(formatDateKey(new Date(2026, 11, 25))).toBe('2026-12-25');
  });

});
