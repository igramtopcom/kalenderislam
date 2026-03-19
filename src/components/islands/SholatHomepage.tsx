import { useState, useEffect, useRef } from 'preact/hooks';
import { getPrayerTimes, formatSholatTime, getTimezoneLabel } from '@/lib/calendar';
import type { Kota } from '@/lib/types';
import kotaData from '@/data/kota.json';

const STORAGE_KEY = 'kalenderislam_kota';

const PRAYERS = [
  { key: 'fajr',    label: 'Subuh'   },
  { key: 'dhuhr',   label: 'Dzuhur'  },
  { key: 'asr',     label: 'Ashar'   },
  { key: 'maghrib', label: 'Maghrib' },
  { key: 'isha',    label: 'Isya'    },
] as const;

interface Props {
  ssrFajr:    string;
  ssrDhuhr:   string;
  ssrAsr:     string;
  ssrMaghrib: string;
  ssrIsha:    string;
  tanggalStr: string;
}

export default function SholatHomepage(props: Props) {
  const [kota, setKota]           = useState<Kota | null>(null);
  const [times, setTimes]         = useState({
    fajr: props.ssrFajr, dhuhr: props.ssrDhuhr,
    asr:  props.ssrAsr,  maghrib: props.ssrMaghrib, isha: props.ssrIsha,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [nextPrayer, setNextPrayer]     = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedKota = JSON.parse(saved) as Kota;
        updateKota(savedKota);
      } else {
        const jakarta = kotaData.find(k => k.slug === 'jakarta') as Kota;
        updateKota(jakarta);
      }
    } catch { /* use SSR default */ }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function updateKota(k: Kota) {
    setKota(k);
    const now = new Date();
    const pt  = getPrayerTimes(k.lat, k.lng, now);
    const tz  = k.timezone;

    setTimes({
      fajr:    formatSholatTime(pt.fajr,    tz),
      dhuhr:   formatSholatTime(pt.dhuhr,   tz),
      asr:     formatSholatTime(pt.asr,     tz),
      maghrib: formatSholatTime(pt.maghrib, tz),
      isha:    formatSholatTime(pt.isha,    tz),
    });

    const dates = [pt.fajr, pt.dhuhr, pt.asr, pt.maghrib, pt.isha];
    const keys  = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    const nextIdx = dates.findIndex(d => d > now);
    setNextPrayer(nextIdx >= 0 ? keys[nextIdx] : 'fajr');
  }

  function selectKota(k: Kota) {
    updateKota(k);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(k)); } catch {}
    setShowDropdown(false);
    setSearchQuery('');
  }

  const filteredKota = searchQuery.trim()
    ? kotaData.filter(k =>
        k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.province.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : kotaData.slice(0, 8);

  const tzLabel  = kota ? getTimezoneLabel(kota.timezone) : 'WIB';
  const kotaName = kota?.name ?? 'Jakarta';
  const kotaSlug = kota?.slug ?? 'jakarta';

  return (
    <div>
      {/* Header */}
      <div style="display:flex; align-items:flex-start; justify-content:space-between;
                  flex-wrap:wrap; gap:12px; margin-bottom:20px;">
        <div>
          <h2 style="font-family:'Lora',serif; font-size:1.4rem; font-weight:600;
                     color:var(--ink); margin:0 0 4px;">
            Jadwal Sholat Hari Ini
          </h2>
          <p style="font-size:0.82rem; color:var(--ink-light); margin:0;">
            {kotaName} — {props.tanggalStr} ·{' '}
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              style="background:none; border:none; padding:0; cursor:pointer;
                     color:var(--green-600); font-size:0.82rem; font-weight:500;"
            >
              Ganti kota →
            </button>
          </p>
          {kota && (
            <span style="display:inline-block; margin-top:4px; font-size:0.7rem;
                          font-weight:600; padding:2px 8px; border-radius:999px;
                          background:var(--green-100); color:var(--green-700);">
              {tzLabel}
            </span>
          )}
        </div>
        <a
          href={`/sholat/${kotaSlug}`}
          style="font-size:0.8rem; font-weight:500; color:var(--green-700); text-decoration:none;
                 padding:6px 14px; border-radius:8px; background:var(--green-50);
                 border:1px solid rgba(29,107,66,.15);"
        >
          Lihat jadwal lengkap →
        </a>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div ref={dropdownRef} style="position:relative; z-index:50; margin-bottom:16px;">
          <div style="background:white; border:1px solid rgba(29,107,66,.2);
                      border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,.1);
                      overflow:hidden;">
            <div style="padding:12px; border-bottom:1px solid rgba(29,107,66,.1);">
              <div style="position:relative;">
                <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%);
                             font-size:14px; color:var(--ink-light);">🔍</span>
                <input
                  type="text"
                  placeholder="Cari kota... (contoh: Surabaya, Makassar)"
                  value={searchQuery}
                  onInput={e => setSearchQuery((e.target as HTMLInputElement).value)}
                  autoFocus
                  style="width:100%; padding:8px 10px 8px 32px; border-radius:8px;
                         border:1.5px solid rgba(29,107,66,.3); font-size:0.85rem;
                         color:var(--ink); outline:none; box-sizing:border-box;"
                />
              </div>
            </div>
            <div style="max-height:240px; overflow-y:auto;">
              {filteredKota.length === 0 ? (
                <div style="padding:20px; text-align:center; font-size:0.85rem;
                            color:var(--ink-light);">
                  Kota tidak ditemukan
                </div>
              ) : (
                filteredKota.map((k, i) => {
                  const isActive = kota?.slug === k.slug;
                  const tzLbl    = getTimezoneLabel(k.timezone);
                  return (
                    <button
                      key={k.slug}
                      type="button"
                      onClick={() => selectKota(k as Kota)}
                      style={`width:100%; display:flex; align-items:center;
                              justify-content:space-between; padding:10px 16px;
                              border:none; cursor:pointer; text-align:left;
                              font-size:0.88rem;
                              background:${isActive ? 'var(--green-50)' : 'white'};
                              color:${isActive ? 'var(--green-700)' : 'var(--ink)'};
                              font-weight:${isActive ? '600' : '400'};
                              border-bottom:${i < filteredKota.length - 1
                                ? '1px solid rgba(29,107,66,.06)' : 'none'};`}
                    >
                      <span>{k.name}
                        <span style="font-size:0.75rem; color:var(--ink-light);
                                     margin-left:6px;">{k.province}</span>
                      </span>
                      <span style={`font-size:0.7rem; font-weight:600; padding:2px 8px;
                                    border-radius:999px;
                                    background:${isActive
                                      ? 'var(--green-100)' : 'var(--green-50)'};
                                    color:${isActive
                                      ? 'var(--green-700)' : 'var(--ink-light)'};`}>
                        {tzLbl} {isActive ? '✓' : ''}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
            <div style="padding:8px; text-align:center; font-size:0.72rem;
                        color:var(--ink-light); border-top:1px solid rgba(29,107,66,.08);">
              100+ kota tersedia · ketik nama kota untuk mencari
            </div>
          </div>
        </div>
      )}

      {/* 5 prayer cards */}
      <div class="sholat-homepage-grid" style="display:grid; grid-template-columns:repeat(5,1fr); gap:12px;">
        {PRAYERS.map(p => {
          const isNext = p.key === nextPrayer;
          return (
            <div
              key={p.key}
              style={`border-radius:16px; padding:16px 8px; text-align:center;
                      transition:all .2s ease;
                      background:${isNext ? 'var(--green-700)' : 'white'};
                      border:1px solid ${isNext
                        ? 'var(--green-700)'
                        : 'rgba(29,107,66,.12)'};`}
            >
              {isNext && (
                <div style="display:flex; justify-content:center; margin-bottom:6px;">
                  <span style="width:6px; height:6px; border-radius:50%;
                               background:var(--green-400);
                               animation:pulse 2s infinite; display:block;"></span>
                </div>
              )}
              <p style={`font-size:0.72rem; font-weight:600; text-transform:uppercase;
                          letter-spacing:.08em; margin:0 0 6px;
                          color:${isNext ? 'var(--green-200)' : 'var(--ink-light)'};`}>
                {p.label}
              </p>
              <p style={`font-family:'Lora',serif; font-size:1.15rem; font-weight:700;
                          margin:0; font-variant-numeric:tabular-nums;
                          color:${isNext ? 'white' : 'var(--ink)'};`}>
                {times[p.key as keyof typeof times]}
              </p>
              <p style={`font-size:0.65rem; margin:4px 0 0;
                          color:${isNext ? 'var(--green-200)' : 'var(--ink-light)'};`}>
                {tzLabel}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .sholat-homepage-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Info metode */}
      <p style="font-size:0.75rem; margin-top:12px; text-align:center;
                color:var(--ink-light);">
        Metode <strong style="color:var(--ink);">Kemenag RI</strong>
        (Fajr 20°, Isha 18°, Mazhab Syafi'i) ·
        <a href={`/sholat/${kotaSlug}`}
           style="color:var(--green-600); text-decoration:none;">
          Lihat jadwal kota lain
        </a>
      </p>
    </div>
  );
}
