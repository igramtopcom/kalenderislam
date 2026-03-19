import { useState, useEffect } from 'preact/hooks';
import { gregorianToHijri } from '@/lib/calendar/hijri';
import { gregorianToJawa } from '@/lib/calendar/jawa';

const BULAN_INDO = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
];
const HARI_INDO = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

interface ConversionResult {
  input: { masehi: string; hari: string; tanggalFormatted: string };
  hijri: { day: number; month: number; year: number; monthName: string; formatted: string };
  jawa:  { pasaran: string; hariJawa: string; neptu: number; weton: string };
}

function convert(dateStr: string): ConversionResult | null {
  if (!dateStr) return null;
  const date = new Date(dateStr + 'T12:00:00');
  if (isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  if (year < 1900 || year > 2099) return null;

  const hijri = gregorianToHijri(date);
  const jawa  = gregorianToJawa(date);
  return {
    input: {
      masehi: dateStr,
      hari: HARI_INDO[date.getDay()],
      tanggalFormatted: `${date.getDate()} ${BULAN_INDO[date.getMonth()]} ${year}`,
    },
    hijri: { day: hijri.day, month: hijri.month, year: hijri.year, monthName: hijri.monthName, formatted: hijri.formatted },
    jawa:  { pasaran: jawa.pasaran, hariJawa: jawa.hariJawa, neptu: jawa.neptu, weton: jawa.weton },
  };
}

export default function DateConverter() {
  const [inputDate, setInputDate] = useState('');
  const [result, setResult]       = useState<ConversionResult | null>(null);
  const [error, setError]         = useState('');
  const [copied, setCopied]       = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tanggal = params.get('tanggal');
    if (tanggal) {
      setInputDate(tanggal);
      const res = convert(tanggal);
      if (res) setResult(res);
    }
  }, []);

  function doConvert(val: string) {
    setInputDate(val);
    setError('');

    if (!val) { setResult(null); return; }

    const year = parseInt(val.split('-')[0]);
    if (year < 1900 || year > 2099) {
      setError('Tanggal harus antara 1 Januari 1900 – 31 Desember 2099');
      setResult(null);
      return;
    }

    const res = convert(val);
    if (res) {
      setResult(res);
      const url = new URL(window.location.href);
      url.searchParams.set('tanggal', val);
      window.history.replaceState({}, '', url.toString());
    }
  }

  function handleInput(e: Event) {
    doConvert((e.target as HTMLInputElement).value);
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div class="max-w-2xl mx-auto">

      {/* Input */}
      <div class="rounded-2xl p-6 mb-6"
           style="background:white; border:1px solid rgba(29,107,66,.12); box-shadow:0 4px 24px rgba(13,61,34,.06);">
        <label for="tanggal-input" class="block text-[0.85rem] font-semibold mb-2" style="color:var(--ink);">
          Masukkan Tanggal Masehi
        </label>
        <input
          id="tanggal-input"
          type="date"
          value={inputDate}
          onInput={handleInput}
          min="1900-01-01"
          max="2099-12-31"
          class="w-full px-4 py-3 rounded-xl text-[1rem] outline-none transition-colors duration-150"
          style="border:1px solid rgba(29,107,66,.2); background:var(--green-50); color:var(--ink); font-family:'Plus Jakarta Sans',sans-serif;"
        />
        {error && <p class="mt-2 text-[0.78rem]" style="color:#991B1B;">{error}</p>}

        <div class="flex flex-wrap gap-2 mt-3">
          {[
            { label: 'Hari ini',    value: new Date().toISOString().split('T')[0] },
            { label: '17 Agt 1945', value: '1945-08-17' },
            { label: '1 Jan 2000',  value: '2000-01-01' },
          ].map(pick => (
            <button
              type="button"
              onClick={() => doConvert(pick.value)}
              class="px-3 py-1 rounded-full text-[0.75rem] font-medium transition-colors duration-150 cursor-pointer"
              style="background:var(--green-50); color:var(--green-700); border:1px solid rgba(29,107,66,.2);"
            >
              {pick.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div class="space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p class="text-[0.78rem]" style="color:var(--ink-light);">Hasil konversi untuk:</p>
              <h2 class="text-[1.3rem] font-semibold" style="font-family:'Lora',serif; color:var(--ink);">
                {result.input.hari}, {result.input.tanggalFormatted}
              </h2>
            </div>
            <button
              type="button"
              onClick={copyUrl}
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.8rem] font-medium transition-colors duration-150 cursor-pointer"
              style={copied
                ? 'background:var(--green-100); color:var(--green-700); border:1px solid rgba(29,107,66,.2);'
                : 'background:white; color:var(--ink-muted); border:1px solid rgba(29,107,66,.12);'}
            >
              {copied ? '✓ Tersalin!' : 'Salin Link'}
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Masehi */}
            <div class="rounded-2xl p-5" style="background:white; border:1px solid rgba(29,107,66,.12);">
              <p class="text-[0.7rem] font-semibold uppercase tracking-widest mb-3" style="color:var(--ink-light);">Masehi</p>
              <p class="text-[1.4rem] font-semibold leading-tight" style="font-family:'Lora',serif; color:var(--ink);">
                {result.input.tanggalFormatted}
              </p>
              <p class="text-[0.8rem] mt-1" style="color:var(--ink-light);">{result.input.hari}</p>
            </div>

            {/* Hijri */}
            <div class="rounded-2xl p-5" style="background:var(--green-800);">
              <p class="text-[0.7rem] font-semibold uppercase tracking-widest mb-3" style="color:var(--green-200); opacity:.7;">Hijriah</p>
              <p class="text-[1.4rem] font-semibold leading-tight" style="font-family:'Lora',serif; color:white;">
                {result.hijri.day} {result.hijri.monthName}
              </p>
              <p class="text-[0.8rem] mt-1" style="color:var(--green-200);">{result.hijri.year} H</p>
            </div>

            {/* Jawa */}
            <div class="rounded-2xl p-5" style="background:rgba(201,162,39,.08); border:1px solid rgba(201,162,39,.25);">
              <p class="text-[0.7rem] font-semibold uppercase tracking-widest mb-3" style="color:var(--gold-600);">Jawa</p>
              <p class="text-[1.4rem] font-semibold leading-tight" style="font-family:'Lora',serif; color:var(--gold-600);">
                {result.jawa.weton}
              </p>
              <p class="text-[0.8rem] mt-1" style="color:var(--gold-600); opacity:.7;">Neptu {result.jawa.neptu}</p>
            </div>
          </div>

          <div class="rounded-xl p-4 text-[0.8rem]"
               style="background:var(--green-50); border:1px solid rgba(29,107,66,.12); color:var(--ink-light);">
            <span class="font-medium" style="color:var(--ink);">Tentang tanggal ini: </span>
            {result.hijri.formatted} · Weton {result.jawa.weton} · Neptu {result.jawa.neptu}
          </div>
        </div>
      )}

      {!result && !error && (
        <div class="text-center py-12" style="color:var(--ink-light);">
          <p class="text-4xl mb-3">📅</p>
          <p class="text-[0.9rem]">Masukkan tanggal di atas untuk melihat hasil konversi</p>
        </div>
      )}
    </div>
  );
}
