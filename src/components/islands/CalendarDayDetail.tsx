import { useState, useEffect, useRef } from 'preact/hooks';
import { gregorianToHijri, gregorianToJawa } from '@/lib/calendar';

interface DayInfo {
  dateStr:     string;
  displayStr:  string;
  hijri:       string;
  weton:       string;
  neptu:       number;
  isHoliday:   boolean;
  holidayName: string;
  isFriday:    boolean;
  bulanSlug:   string;
  tahun:       number;
}

interface Props {
  holidays: Record<string, string>;
  todayStr: string;
}

const HARI_INDO  = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const BULAN_INDO = [
  'januari','februari','maret','april','mei','juni',
  'juli','agustus','september','oktober','november','desember'
];
const BULAN_DISPLAY = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

export default function CalendarDayDetail({ holidays, todayStr }: Props) {
  const [selected, setSelected] = useState<DayInfo | null>(null);
  const selectedRef = useRef<DayInfo | null>(null);

  // Keep ref in sync
  selectedRef.current = selected;

  useEffect(() => {
    const handleDayClick = (e: Event) => {
      const dateStr = (e as CustomEvent).detail.dateStr as string;

      // Skip hari ini
      if (dateStr === todayStr) {
        setSelected(null);
        return;
      }

      // Toggle: klik sama → tutup
      if (selectedRef.current?.dateStr === dateStr) {
        setSelected(null);
        return;
      }

      // Hitung detail
      const date      = new Date(dateStr + 'T12:00:00');
      const hijri     = gregorianToHijri(date);
      const jawa      = gregorianToJawa(date);
      const hariNama  = HARI_INDO[date.getDay()];
      const bulanNama = BULAN_DISPLAY[date.getMonth()];

      setSelected({
        dateStr,
        displayStr:  `${hariNama}, ${date.getDate()} ${bulanNama} ${date.getFullYear()}`,
        hijri:       `${hijri.day} ${hijri.monthName} ${hijri.year} H`,
        weton:       jawa.weton,
        neptu:       jawa.neptu,
        isHoliday:   !!holidays[dateStr],
        holidayName: holidays[dateStr] ?? '',
        isFriday:    date.getDay() === 5,
        bulanSlug:   BULAN_INDO[date.getMonth()],
        tahun:       date.getFullYear(),
      });
    };

    window.addEventListener('kalender-day-click', handleDayClick);
    return () => window.removeEventListener('kalender-day-click', handleDayClick);
  }, [todayStr]); // Only depend on todayStr, use ref for selected

  if (!selected) return null;

  return (
    <div
      class="mt-3 rounded-2xl overflow-hidden animate-fade-up"
      style="background:var(--green-50); border:1px solid rgba(29,107,66,.2);"
    >
      {/* Header */}
      <div
        class="flex items-center justify-between px-4 py-3"
        style="border-bottom:1px solid rgba(29,107,66,.12);"
      >
        <div>
          <p
            class="font-semibold text-[0.95rem]"
            style={`font-family:'Lora',serif;
                    color:${selected.isFriday ? 'var(--green-700)' : 'var(--ink)'};`}
          >
            {selected.displayStr}
          </p>
          <p class="text-[0.75rem] mt-0.5" style="color:var(--ink-light);">
            {selected.hijri}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSelected(null)}
          class="w-7 h-7 rounded-full flex items-center justify-center
                 transition-colors duration-150 text-[1rem]"
          style="background:rgba(29,107,66,.1); color:var(--ink-light);
                 border:none; cursor:pointer;"
          aria-label="Tutup"
        >
          ×
        </button>
      </div>

      {/* Detail grid */}
      <div class="p-4 grid grid-cols-2 gap-3">
        <div
          class="rounded-xl p-3"
          style="background:white; border:1px solid rgba(29,107,66,.1);"
        >
          <p class="text-[0.68rem] uppercase tracking-wider mb-1"
             style="color:var(--ink-light);">Hijriah</p>
          <p class="text-[0.9rem] font-semibold" style="color:var(--ink);">
            {selected.hijri}
          </p>
        </div>

        <div
          class="rounded-xl p-3"
          style="background:white; border:1px solid rgba(29,107,66,.1);"
        >
          <p class="text-[0.68rem] uppercase tracking-wider mb-1"
             style="color:var(--ink-light);">Weton Jawa</p>
          <p class="text-[0.9rem] font-semibold" style="color:var(--ink);">
            {selected.weton}
            <span
              class="ml-2 text-[0.72rem] font-semibold px-1.5 py-0.5 rounded-full"
              style="background:rgba(201,162,39,.15); color:var(--gold-500);"
            >
              Neptu {selected.neptu}
            </span>
          </p>
        </div>
      </div>

      {/* Badge hari besar */}
      {selected.isHoliday && (
        <div
          class="mx-4 mb-3 px-3 py-2 rounded-xl flex items-center gap-2"
          style="background:var(--gold-100); border:1px solid rgba(201,162,39,.3);"
        >
          <span class="text-base">🎉</span>
          <div>
            <p class="text-[0.82rem] font-semibold" style="color:var(--gold-600);">
              {selected.holidayName}
            </p>
            <p class="text-[0.7rem]" style="color:var(--gold-600); opacity:.7;">
              Hari Libur Nasional
            </p>
          </div>
        </div>
      )}

      {/* Link ke halaman kalender bulanan */}
      <div class="px-4 pb-4">
        <a
          href={`/kalender/${selected.tahun}/${selected.bulanSlug}`}
          class="flex items-center justify-between px-4 py-2.5 rounded-xl
                 no-underline transition-colors duration-150"
          style="background:var(--green-700); color:white;"
        >
          <span class="text-[0.82rem] font-medium">
            Lihat kalender {BULAN_DISPLAY[new Date(selected.dateStr + 'T12:00:00').getMonth()]} {selected.tahun} lengkap
          </span>
          <span class="text-[0.9rem]">→</span>
        </a>
      </div>
    </div>
  );
}
