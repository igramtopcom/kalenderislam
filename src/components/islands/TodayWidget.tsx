import { useState, useEffect } from 'preact/hooks';
// Import directly — NOT from barrel index to avoid bundling adhan/prayer.ts
import { gregorianToHijri } from '@/lib/calendar/hijri';
import { gregorianToJawa } from '@/lib/calendar/jawa';

const HARI_INDO  = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const BULAN_INDO = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];

interface TodayData {
  hariIni: string;
  tanggal: number;
  bulan:   string;
  tahun:   number;
  hijri: {
    day: number;
    monthNameShort: string;
    year: number;
    formatted: string;
  };
  jawa: {
    weton: string;
    neptu: number;
  };
}

function getTodayData(): TodayData {
  const today = new Date();
  const hijri = gregorianToHijri(today);
  const jawa  = gregorianToJawa(today);
  return {
    hariIni: HARI_INDO[today.getDay()],
    tanggal: today.getDate(),
    bulan:   BULAN_INDO[today.getMonth()],
    tahun:   today.getFullYear(),
    hijri: {
      day: hijri.day,
      monthNameShort: hijri.monthNameShort,
      year: hijri.year,
      formatted: hijri.formatted,
    },
    jawa: {
      weton: jawa.weton,
      neptu: jawa.neptu,
    },
  };
}

function msUntilMidnightWIB(): number {
  const now    = new Date();
  const utcNow = now.getTime() + now.getTimezoneOffset() * 60_000;
  const wibNow = new Date(utcNow + 7 * 3_600_000);

  const nextMidnight = new Date(wibNow);
  nextMidnight.setHours(24, 0, 0, 0);

  return nextMidnight.getTime() - wibNow.getTime();
}

export default function TodayWidget() {
  const [data, setData]       = useState<TodayData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setData(getTodayData());

    const scheduleUpdate = () => {
      const ms = msUntilMidnightWIB();
      const timeout = setTimeout(() => {
        setData(getTodayData());
        scheduleUpdate();
      }, ms);
      return timeout;
    };

    const timeout = scheduleUpdate();
    return () => clearTimeout(timeout);
  }, []);

  if (!mounted || !data) {
    return (
      <div class="animate-pulse">
        <div class="h-8 w-48 rounded-lg mb-2" style="background:rgba(255,255,255,.1);"></div>
        <div class="h-4 w-32 rounded-lg mb-6" style="background:rgba(255,255,255,.1);"></div>
        <div class="grid grid-cols-2 gap-2.5">
          <div class="h-20 rounded-xl" style="background:rgba(255,255,255,.07);"></div>
          <div class="h-20 rounded-xl" style="background:rgba(255,255,255,.07);"></div>
          <div class="col-span-2 h-16 rounded-xl" style="background:rgba(201,162,39,.1);"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1
        style="font-family:'Lora',serif;
               font-size:clamp(2rem,4vw,2.8rem);
               font-weight:700; color:white; line-height:1.1;"
      >
        {data.hariIni}, {data.tanggal} {data.bulan} {data.tahun}
      </h1>
      <p class="mb-6" style="font-size:1rem; color:var(--green-200);">
        {data.hijri.formatted}
      </p>

      <div class="grid grid-cols-2 gap-2.5">
        {/* Hijri */}
        <div class="rounded-xl p-3"
             style="background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);">
          <p class="text-[0.65rem] font-semibold uppercase tracking-widest mb-1"
             style="color:rgba(255,255,255,.5);">Hijriah</p>
          <p class="text-[1.05rem] font-semibold" style="color:white;">
            {data.hijri.day} {data.hijri.monthNameShort}
          </p>
          <p class="text-[0.72rem]" style="color:var(--green-200);">
            {data.hijri.year} H
          </p>
        </div>

        {/* Masehi */}
        <div class="rounded-xl p-3"
             style="background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);">
          <p class="text-[0.65rem] font-semibold uppercase tracking-widest mb-1"
             style="color:rgba(255,255,255,.5);">Masehi</p>
          <p class="text-[1.05rem] font-semibold" style="color:white;">
            {data.tanggal} {data.bulan.slice(0,3)}
          </p>
          <p class="text-[0.72rem]" style="color:var(--green-200);">{data.tahun}</p>
        </div>

        {/* Weton — gold, full width */}
        <div class="col-span-2 rounded-xl p-3"
             style="background:rgba(201,162,39,.15); border:1px solid rgba(201,162,39,.3);">
          <p class="text-[0.65rem] font-semibold uppercase tracking-widest mb-1"
             style="color:rgba(201,162,39,.7);">Weton Jawa</p>
          <div class="flex items-center justify-between">
            <p class="text-[1.2rem] font-semibold"
               style="font-family:'Lora',serif; color:var(--gold-400);">
              {data.jawa.weton}
            </p>
            <span class="text-[0.72rem] font-semibold px-2 py-0.5 rounded-full"
                  style="background:rgba(201,162,39,.2); color:var(--gold-400);">
              Neptu {data.jawa.neptu}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
