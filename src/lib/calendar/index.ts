export * from './hijri';
export * from './jawa';
export * from './prayer';
export * from './holidays';

// ─── Calendar Grid Helpers ───────────────────────────────────────────────────

import { gregorianToHijri } from './hijri';
import { gregorianToJawa } from './jawa';
import type { NationalHoliday } from '@/lib/types';

export interface DayCell {
  date:        Date;
  dayMasehi:   number;
  hijri:       ReturnType<typeof gregorianToHijri>;
  jawa:        ReturnType<typeof gregorianToJawa>;
  isToday:     boolean;
  isFriday:    boolean;
  isHoliday:   boolean;
  holidayName?: string;
  isOtherMonth: boolean;
  dateKey:     string;
}

export interface MonthCalendar {
  year:       number;
  month:      number;
  monthName:  string;
  hijriLabel: string;
  days:       DayCell[];
  prevMonth:  { year: number; month: number };
  nextMonth:  { year: number; month: number };
}

const BULAN_INDO = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

export { BULAN_INDO };

export const BULAN_SLUG: Record<string, number> = {
  'januari':   0, 'februari':  1, 'maret':     2, 'april':     3,
  'mei':       4, 'juni':      5, 'juli':      6, 'agustus':   7,
  'september': 8, 'oktober':   9, 'november':  10, 'desember':  11,
};

export const SLUG_BULAN = Object.fromEntries(
  Object.entries(BULAN_SLUG).map(([k, v]) => [v, k])
) as Record<number, string>;

export function generateMonthCalendar(
  year: number,
  month: number,
  holidayMap: Map<string, NationalHoliday> = new Map(),
): MonthCalendar {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();

  // 42 cells = 6 rows × 7 columns
  const days: DayCell[] = [];

  for (let i = 0; i < 42; i++) {
    const dayOffset = i - startOffset;
    const date = new Date(year, month, 1 + dayOffset);
    date.setHours(12, 0, 0, 0);

    const isOtherMonth = date.getMonth() !== month;
    const dateKey = fmtDateKey(date);
    const holiday = holidayMap.get(dateKey);

    const cellDate = new Date(date);
    cellDate.setHours(0, 0, 0, 0);

    days.push({
      date,
      dayMasehi:    date.getDate(),
      hijri:        gregorianToHijri(date),
      jawa:         gregorianToJawa(date),
      isToday:      cellDate.getTime() === today.getTime(),
      isFriday:     date.getDay() === 5,
      isHoliday:    !!holiday,
      holidayName:  holiday?.nama,
      isOtherMonth,
      dateKey,
    });
  }

  // Hijri label for header
  const hijriMonths = [...new Set(
    days.filter(d => !d.isOtherMonth).map(d => d.hijri.monthName)
  )];
  const midHijri = days[20].hijri;
  const hijriLabel = hijriMonths.length > 1
    ? `${hijriMonths[0]} – ${hijriMonths[1]} ${midHijri.year} H`
    : `${hijriMonths[0]} ${midHijri.year} H`;

  const prevDate = new Date(year, month - 1, 1);
  const nextDate = new Date(year, month + 1, 1);

  return {
    year, month,
    monthName: BULAN_INDO[month],
    hijriLabel,
    days,
    prevMonth: { year: prevDate.getFullYear(), month: prevDate.getMonth() },
    nextMonth: { year: nextDate.getFullYear(), month: nextDate.getMonth() },
  };
}

function fmtDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ─── Ramadan Helpers ─────────────────────────────────────────────────────────

export function calcRamadanEndDate(startDateStr: string, totalDays: number = 30): string {
  const start = new Date(startDateStr + 'T12:00:00');
  const end   = new Date(start);
  end.setDate(end.getDate() + totalDays - 1);
  return end.toISOString().split('T')[0];
}

export function calcIdulFitriDate(startDateStr: string, totalDays: number = 30): string {
  const start = new Date(startDateStr + 'T12:00:00');
  const idul  = new Date(start);
  idul.setDate(idul.getDate() + totalDays);
  return idul.toISOString().split('T')[0];
}
