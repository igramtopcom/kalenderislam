import { useState, useEffect } from 'preact/hooks';
import { getPrayerTimes, formatSholatTime, getTimezoneLabel } from '@/lib/calendar/prayer';
import type { Kota } from '@/lib/types';

// Import kota data directly to avoid bundling adhan via barrel
import kotaData from '@/data/kota.json';

const DEFAULT_KOTA: Kota = {
  slug: 'jakarta', name: 'Jakarta', province: 'DKI Jakarta',
  lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta', elevation: 8,
};

function getNextKey(lat: number, lng: number, now: Date): string {
  const t = getPrayerTimes(lat, lng, now);
  if (now < t.fajr) return 'fajr';
  if (now < t.dhuhr) return 'dhuhr';
  if (now < t.asr) return 'asr';
  if (now < t.maghrib) return 'maghrib';
  if (now < t.isha) return 'isha';
  return 'fajr';
}

function findNearestKota(lat: number, lng: number): Kota {
  let nearest = DEFAULT_KOTA;
  let minDist = Infinity;
  for (const kota of kotaData as Kota[]) {
    const dist = Math.sqrt(Math.pow(kota.lat - lat, 2) + Math.pow(kota.lng - lng, 2));
    if (dist < minDist) { minDist = dist; nearest = kota; }
  }
  return nearest;
}

const STORAGE_KEY = 'kalenderislam_kota';

export default function PrayerBar() {
  const [kota, setKota] = useState<Kota>(DEFAULT_KOTA);
  const [prayers, setPrayers] = useState<Array<{ key: string; label: string; time: string; isNext: boolean }>>([]);
  const [mounted, setMounted] = useState(false);

  function updatePrayers(k: Kota) {
    const now = new Date();
    const times = getPrayerTimes(k.lat, k.lng, now);
    const nextKey = getNextKey(k.lat, k.lng, now);

    setPrayers([
      { key: 'fajr', label: 'Subuh', time: formatSholatTime(times.fajr, k.timezone), isNext: nextKey === 'fajr' },
      { key: 'dhuhr', label: 'Dzuhur', time: formatSholatTime(times.dhuhr, k.timezone), isNext: nextKey === 'dhuhr' },
      { key: 'asr', label: 'Ashar', time: formatSholatTime(times.asr, k.timezone), isNext: nextKey === 'asr' },
      { key: 'maghrib', label: 'Maghrib', time: formatSholatTime(times.maghrib, k.timezone), isNext: nextKey === 'maghrib' },
      { key: 'isha', label: 'Isya', time: formatSholatTime(times.isha, k.timezone), isNext: nextKey === 'isha' },
    ]);
  }

  useEffect(() => {
    setMounted(true);

    let savedKota = DEFAULT_KOTA;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) { const p = JSON.parse(raw) as Kota; if (p.slug) savedKota = p; }
    } catch { /* ignore */ }

    setKota(savedKota);
    updatePrayers(savedKota);

    const interval = setInterval(() => updatePrayers(savedKota), 60_000);

    // Geolocation only if no saved kota
    if (!localStorage.getItem(STORAGE_KEY) && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = findNearestKota(pos.coords.latitude, pos.coords.longitude);
          setKota(nearest);
          updatePrayers(nearest);
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nearest)); } catch { /* ignore */ }
        },
        () => { /* denied — keep default */ },
        { timeout: 5000 }
      );
    }

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <div class="flex items-center justify-between gap-4 w-full overflow-x-auto">
      <a href={`/sholat/${kota.slug}`}
         class="text-[0.72rem] font-semibold uppercase tracking-widest whitespace-nowrap flex-shrink-0 no-underline transition-colors duration-150"
         style="color:var(--green-200) !important;">
        {kota.name.toUpperCase()}
      </a>

      <div class="flex items-center gap-2 flex-wrap justify-end">
        {prayers.map(p => (
          <div class="flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] transition-all duration-300"
               style={p.isNext
                 ? 'background:rgba(29,158,117,.25); border:1px solid rgba(29,158,117,.5);'
                 : 'background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.09);'}>
            {p.isNext && (
              <span class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style="background:var(--green-400); animation:pulse 2s infinite;"></span>
            )}
            <span style={p.isNext ? 'color:var(--green-200);' : 'color:rgba(255,255,255,.5);'}>{p.label}</span>
            <span class="font-semibold tabular-nums" style={p.isNext ? 'color:var(--green-400);' : 'color:white;'}>{p.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
