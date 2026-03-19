import { useState, useEffect } from 'preact/hooks';

interface Props {
  targetDate: string;  // 'YYYY-MM-DD'
  eventName:  string;
}

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number;
}

function calcTimeLeft(targetDate: string): TimeLeft | null {
  const target = new Date(targetDate + 'T00:00:00+07:00'); // WIB
  const now    = new Date();
  const diff   = target.getTime() - now.getTime();
  if (diff <= 0) return null;

  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

export default function Countdown({ targetDate, eventName }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calcTimeLeft(targetDate));

    const interval = setInterval(() => {
      const tl = calcTimeLeft(targetDate);
      setTimeLeft(tl);
      if (!tl) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return (
    <div class="flex gap-3">
      {['Hari','Jam','Menit','Detik'].map(label => (
        <div class="text-center min-w-[60px]">
          <div class="h-10 rounded-lg mb-1 animate-pulse" style="background:rgba(255,255,255,.1);"></div>
          <p class="text-[0.62rem] uppercase" style="color:var(--green-200);">{label}</p>
        </div>
      ))}
    </div>
  );

  if (!timeLeft) {
    return (
      <p class="text-[1rem] font-semibold" style="color:var(--gold-400);">
        {eventName} telah tiba!
      </p>
    );
  }

  const units = [
    { label: 'Hari',   value: timeLeft.days },
    { label: 'Jam',    value: timeLeft.hours },
    { label: 'Menit',  value: timeLeft.minutes },
    { label: 'Detik',  value: timeLeft.seconds },
  ];

  return (
    <div class="flex gap-3 flex-wrap">
      {units.map(({ label, value }) => (
        <div class="text-center min-w-[60px]">
          <div class="rounded-lg px-3 py-2 mb-1" style="background:rgba(255,255,255,.1);">
            <p class="text-[1.6rem] font-bold leading-none"
               style="font-family:'Lora',serif; color:var(--gold-400);">
              {String(value).padStart(2, '0')}
            </p>
          </div>
          <p class="text-[0.62rem] font-medium uppercase tracking-wider"
             style="color:var(--green-200);">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
