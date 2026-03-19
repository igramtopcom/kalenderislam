import { useState, useEffect } from 'preact/hooks';
import { getPrayerTimes, formatSholatTime, getTimezoneLabel } from '@/lib/calendar/prayer';

interface Props {
  lat: number;
  lng: number;
  timezone: string;
  kotaName: string;
}

function getNextKey(lat: number, lng: number, now: Date): string {
  const t = getPrayerTimes(lat, lng, now);
  if (now < t.fajr)    return 'fajr';
  if (now < t.dhuhr)   return 'dhuhr';
  if (now < t.asr)     return 'asr';
  if (now < t.maghrib) return 'maghrib';
  if (now < t.isha)    return 'isha';
  return 'fajr';
}

export default function PrayerTimesWidget({ lat, lng, timezone }: Props) {
  const [mounted, setMounted]     = useState(false);
  const [nextPrayer, setNextPrayer] = useState('');
  const [now, setNow]             = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const n = new Date();
      setNow(n);
      setNextPrayer(getNextKey(lat, lng, n));
    };
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, [lat, lng]);

  if (!mounted) return null;

  const times = getPrayerTimes(lat, lng, now);
  const tzLabel = getTimezoneLabel(timezone);

  const prayers = [
    { key: 'fajr',    name: 'Subuh',   time: formatSholatTime(times.fajr,    timezone) },
    { key: 'dhuhr',   name: 'Dzuhur',  time: formatSholatTime(times.dhuhr,   timezone) },
    { key: 'asr',     name: 'Ashar',   time: formatSholatTime(times.asr,     timezone) },
    { key: 'maghrib', name: 'Maghrib', time: formatSholatTime(times.maghrib, timezone) },
    { key: 'isha',    name: 'Isya',    time: formatSholatTime(times.isha,    timezone) },
  ];

  return (
    <div>
      <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {prayers.map(p => {
          const isNext = p.key === nextPrayer;
          return (
            <div
              class="rounded-2xl p-4 text-center transition-all duration-300"
              style={isNext
                ? 'background:var(--green-700); box-shadow:0 4px 20px rgba(21,82,50,.3);'
                : 'background:white; border:1px solid rgba(29,107,66,.12);'}
            >
              {isNext && (
                <div class="flex justify-center mb-2">
                  <span class="w-2 h-2 rounded-full" style="background:var(--green-400); animation:pulse 2s infinite;"></span>
                </div>
              )}
              <p class="text-[0.72rem] font-semibold uppercase tracking-wider mb-1"
                 style={isNext ? 'color:var(--green-200);' : 'color:var(--ink-light);'}>{p.name}</p>
              <p class="text-[1.2rem] font-bold tabular-nums"
                 style={`font-family:'Lora',serif; color:${isNext ? 'white' : 'var(--ink)'};`}>{p.time}</p>
              <p class="text-[0.65rem] mt-0.5"
                 style={isNext ? 'color:var(--green-200);' : 'color:var(--ink-light);'}>{tzLabel}</p>
            </div>
          );
        })}
      </div>

      <div class="mt-4 rounded-xl px-4 py-3 flex items-center gap-3"
           style="background:var(--green-50); border:1px solid rgba(29,107,66,.12);">
        <span class="text-xl">🕌</span>
        <p class="text-[0.85rem]" style="color:var(--ink);">
          Waktu sholat berikutnya:{' '}
          <strong style="color:var(--green-700);">{prayers.find(p => p.key === nextPrayer)?.name ?? 'Subuh'}</strong>
          {' '}pukul{' '}
          <strong style="color:var(--green-700);">{prayers.find(p => p.key === nextPrayer)?.time ?? '--:--'} {tzLabel}</strong>
        </p>
      </div>
    </div>
  );
}
