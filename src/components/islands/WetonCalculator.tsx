import { useState, useEffect } from 'preact/hooks';
import { gregorianToHijri } from '@/lib/calendar/hijri';
import { gregorianToJawa, getNeptuMeaning } from '@/lib/calendar/jawa';

const BULAN_INDO = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];
const HARI_INDO = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

const PASARAN_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  'Kliwon': { bg: 'rgba(21,82,50,.1)',   text: 'var(--green-700)',  border: 'rgba(21,82,50,.2)'   },
  'Legi':   { bg: 'rgba(201,162,39,.1)', text: 'var(--gold-600)',   border: 'rgba(201,162,39,.3)' },
  'Pahing': { bg: 'rgba(29,107,66,.1)',  text: 'var(--green-600)',  border: 'rgba(29,107,66,.2)'  },
  'Pon':    { bg: 'rgba(13,61,34,.08)',  text: 'var(--green-800)',  border: 'rgba(13,61,34,.15)'  },
  'Wage':   { bg: 'rgba(226,188,69,.1)', text: '#8B6914',          border: 'rgba(226,188,69,.3)' },
};

interface SavedWeton {
  name:      string;
  birthDate: string;
  weton:     string;
  neptu:     number;
}

interface WetonResult {
  birthDate:        string;
  tanggalFormatted: string;
  hari:             string;
  hijriFormatted:   string;
  jawa: {
    pasaran:  string;
    hariJawa: string;
    neptu:    number;
    weton:    string;
  };
  meaning: string;
}

function calculate(dateStr: string): WetonResult | null {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T12:00:00');
  if (isNaN(date.getTime())) return null;
  if (date.getFullYear() < 1900 || date.getFullYear() > 2099) return null;

  const hijri = gregorianToHijri(date);
  const jawa  = gregorianToJawa(date);

  return {
    birthDate:        dateStr,
    tanggalFormatted: `${date.getDate()} ${BULAN_INDO[date.getMonth()]} ${date.getFullYear()}`,
    hari:             HARI_INDO[date.getDay()],
    hijriFormatted:   hijri.formatted,
    jawa: { pasaran: jawa.pasaran, hariJawa: jawa.hariJawa, neptu: jawa.neptu, weton: jawa.weton },
    meaning:          getNeptuMeaning(jawa.neptu),
  };
}

const STORAGE_KEY = 'kalenderislam_weton';

export default function WetonCalculator() {
  const [inputDate, setInputDate] = useState('');
  const [name, setName]           = useState('');
  const [result, setResult]       = useState<WetonResult | null>(null);
  const [saved, setSaved]         = useState<SavedWeton[]>([]);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedWeton[];
        setSaved(parsed);
        if (parsed.length > 0) {
          const last = parsed[parsed.length - 1];
          setInputDate(last.birthDate);
          setName(last.name === 'Tanpa nama' ? '' : last.name);
          setResult(calculate(last.birthDate));
        }
      }
    } catch { /* localStorage unavailable */ }
  }, []);

  function handleDateInput(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    setInputDate(val);
    if (val) setResult(calculate(val));
    else setResult(null);
  }

  function saveWeton() {
    if (!result) return;
    const entry: SavedWeton = {
      name:      name || 'Tanpa nama',
      birthDate: result.birthDate,
      weton:     result.jawa.weton,
      neptu:     result.jawa.neptu,
    };
    const updated = [...saved.filter(s => s.birthDate !== entry.birthDate), entry].slice(-5);
    setSaved(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  }

  function loadSaved(s: SavedWeton) {
    setInputDate(s.birthDate);
    setName(s.name === 'Tanpa nama' ? '' : s.name);
    setResult(calculate(s.birthDate));
  }

  function deleteSaved(birthDate: string) {
    const updated = saved.filter(s => s.birthDate !== birthDate);
    setSaved(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
  }

  if (!mounted) return (
    <div class="animate-pulse space-y-4">
      <div class="h-12 rounded-xl" style="background:rgba(29,107,66,.1);"></div>
      <div class="h-40 rounded-2xl" style="background:rgba(29,107,66,.05);"></div>
    </div>
  );

  const pasaranColor = result
    ? PASARAN_COLOR[result.jawa.pasaran] ?? PASARAN_COLOR['Kliwon']
    : null;

  return (
    <div class="max-w-xl mx-auto space-y-6">

      {/* Input Form */}
      <div class="rounded-2xl p-6"
           style="background:white; border:1px solid rgba(29,107,66,.12); box-shadow:0 4px 24px rgba(13,61,34,.06);">
        <h2 class="text-[1.1rem] font-semibold mb-4" style="font-family:'Lora',serif; color:var(--ink);">
          Hitung Weton
        </h2>
        <div class="space-y-3">
          <div>
            <label class="block text-[0.8rem] font-medium mb-1" style="color:var(--ink-muted);">Nama (opsional)</label>
            <input
              type="text"
              placeholder="Misal: Budi, Siti, ..."
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              class="w-full px-4 py-2.5 rounded-xl text-[0.9rem] outline-none transition-colors duration-150"
              style="border:1px solid rgba(29,107,66,.2); background:var(--green-50); color:var(--ink); font-family:'Plus Jakarta Sans',sans-serif;"
            />
          </div>
          <div>
            <label for="weton-date" class="block text-[0.8rem] font-medium mb-1" style="color:var(--ink-muted);">Tanggal Lahir</label>
            <input
              id="weton-date"
              type="date"
              value={inputDate}
              onInput={handleDateInput}
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
              class="w-full px-4 py-2.5 rounded-xl text-[0.9rem] outline-none transition-colors duration-150"
              style="border:1px solid rgba(29,107,66,.2); background:var(--green-50); color:var(--ink); font-family:'Plus Jakarta Sans',sans-serif;"
            />
          </div>
        </div>
      </div>

      {/* Result Card */}
      {result && pasaranColor && (
        <div class="rounded-2xl overflow-hidden"
             style="border:1px solid rgba(29,107,66,.12); box-shadow:0 4px 24px rgba(13,61,34,.06);">
          {/* Header with pasaran color */}
          <div class="p-6 text-center"
               style={`background:${pasaranColor.bg}; border-bottom:1px solid ${pasaranColor.border};`}>
            {name && (
              <p class="text-[0.8rem] font-medium mb-1" style="color:var(--ink-light);">Weton {name}</p>
            )}
            <p class="text-[2.2rem] font-bold leading-tight"
               style={`font-family:'Lora',serif; color:${pasaranColor.text};`}>
              {result.jawa.weton}
            </p>
            <div class="flex items-center justify-center gap-3 mt-2">
              <span class="px-3 py-1 rounded-full text-[0.78rem] font-semibold"
                    style={`background:${pasaranColor.border}; color:${pasaranColor.text};`}>
                Neptu {result.jawa.neptu}
              </span>
            </div>
          </div>

          {/* Detail */}
          <div class="p-5 space-y-4" style="background:white;">
            <div class="rounded-xl p-4"
                 style="background:var(--green-50); border:1px solid rgba(29,107,66,.1);">
              <p class="text-[0.7rem] font-semibold uppercase tracking-wider mb-1" style="color:var(--green-600);">
                Karakter (dari neptu {result.jawa.neptu})
              </p>
              <p class="text-[0.9rem] font-medium" style="color:var(--ink);">{result.meaning}</p>
            </div>

            <div class="grid grid-cols-2 gap-3 text-[0.82rem]">
              <div>
                <p class="text-[0.7rem] uppercase tracking-wider mb-0.5" style="color:var(--ink-light);">Lahir (Masehi)</p>
                <p class="font-medium" style="color:var(--ink);">{result.hari}, {result.tanggalFormatted}</p>
              </div>
              <div>
                <p class="text-[0.7rem] uppercase tracking-wider mb-0.5" style="color:var(--ink-light);">Lahir (Hijriah)</p>
                <p class="font-medium" style="color:var(--ink);">{result.hijriFormatted}</p>
              </div>
              <div>
                <p class="text-[0.7rem] uppercase tracking-wider mb-0.5" style="color:var(--ink-light);">Hari Jawa</p>
                <p class="font-medium" style="color:var(--ink);">{result.jawa.hariJawa}</p>
              </div>
              <div>
                <p class="text-[0.7rem] uppercase tracking-wider mb-0.5" style="color:var(--ink-light);">Pasaran</p>
                <p class="font-medium" style={`color:${pasaranColor.text};`}>{result.jawa.pasaran}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={saveWeton}
              class="w-full py-2.5 rounded-xl text-[0.85rem] font-semibold transition-colors duration-150 cursor-pointer"
              style="background:var(--green-700); color:white !important;"
            >
              Simpan Weton {name || ''}
            </button>
          </div>
        </div>
      )}

      {/* Saved wetons */}
      {saved.length > 0 && (
        <div class="rounded-2xl p-5" style="background:white; border:1px solid rgba(29,107,66,.12);">
          <h3 class="text-[0.85rem] font-semibold mb-3" style="color:var(--ink);">Weton Tersimpan</h3>
          <div class="space-y-2">
            {saved.map(s => (
              <div
                class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors duration-150 group"
                style="background:var(--green-50); border:1px solid rgba(29,107,66,.08);"
                onClick={() => loadSaved(s)}
              >
                <div>
                  <p class="text-[0.85rem] font-medium" style="color:var(--ink);">{s.name}</p>
                  <p class="text-[0.75rem]" style="color:var(--ink-light);">
                    {s.weton} · Neptu {s.neptu} · {s.birthDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); deleteSaved(s.birthDate); }}
                  class="opacity-0 group-hover:opacity-100 text-[0.75rem] px-2 py-1 rounded-lg transition-opacity duration-150 cursor-pointer"
                  style="color:#991B1B; background:#FEE2E2;"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && (
        <div class="text-center py-10" style="color:var(--ink-light);">
          <p class="text-4xl mb-3">⭐</p>
          <p class="text-[0.9rem]">Masukkan tanggal lahir untuk mengetahui weton Anda</p>
        </div>
      )}
    </div>
  );
}
