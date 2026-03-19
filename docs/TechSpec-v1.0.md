
TECHNICAL SPECIFICATION
KalenderIslam.id
Untuk Dev Agent (Claude CLI) — Panduan Implementasi Teknis Lengkap


Field
Detail
Dokumen
Technical Specification (Tech Spec)
Versi
v1.0 — Initial Release
Ditujukan Untuk
Dev Agent — Claude CLI
Framework
Astro v4+ (output: static) + Cloudflare Pages
Runtime
Node.js 20+ untuk build; Cloudflare Workers untuk API routes
Bahasa
TypeScript (strict mode)
Database
Supabase (PostgreSQL) — hanya 3 tabel
Baca Juga
PRD v1.0 untuk user stories dan acceptance criteria

Instruksi untuk Dev Agent
Baca dokumen ini dari awal sampai akhir sebelum mulai coding. Setup struktur direktori dan algoritma kalender TERLEBIH DAHULU sebelum membuat komponen UI apapun. Semua algoritma harus lulus unit test sebelum digunakan di halaman.

1. Arsitektur Sistem

1.1 Stack Lengkap
Layer
Teknologi
Versi
Justifikasi
Framework
Astro
4.x (latest)
Zero JS by default; Islands Architecture; cocok untuk 1000+ static pages; build time cepat
Language
TypeScript
5.x (strict)
Type safety untuk algoritma kalender; mencegah bug tanggal Hijri/Jawa yang sulit dideteksi
Styling
Tailwind CSS
3.x
Atomic CSS; zero runtime; mobile-first; JIT compiler
Calendar Engine
Custom (ditulis dari scratch)
—
Tidak ada library Jawa yang reliable; Hijri: algoritma Umm al-Qura
Prayer Times
adhan-js
3.x
Standard library; port dari iOS/Android Adhan; metode Kemenag tersedia; offline
Database
Supabase
—
Free tier cukup (500MB); dashboard built-in untuk admin non-teknis; hanya 3 tabel
Hosting
Cloudflare Pages
—
Free unlimited bandwidth; Jakarta PoP <50ms; official Astro adapter
API Routes
Cloudflare Workers
—
Edge runtime via @astrojs/cloudflare; dipakai untuk /api/* endpoints
Analytics
Umami
2.x (self-hosted)
GDPR compliant; tidak butuh cookie banner; data 100% milik sendiri
Push Notif
Firebase Cloud Messaging
—
Gratis unlimited; integrasi dengan Astro Service Worker
OG Image
Satori (via Astro endpoint)
—
Generate gambar dinamis di edge; tidak butuh Puppeteer/Chrome

1.2 Prinsip Arsitektur
Zero JS First
Semua halaman statis harus menghasilkan 0KB JavaScript ke browser. JS hanya boleh ada di Astro Islands (komponen interaktif) yang diberi client:load atau client:visible.

Evergreen by Algorithm
Tidak ada konten kalender yang ditulis manual. Semua tanggal Hijri, Jawa, dan waktu sholat dihitung pada build time dari algoritma. Menambah tahun baru = tambah angka di array getStaticPaths().

Data Immutability
Algoritma kalender adalah pure functions — input yang sama selalu menghasilkan output yang sama. Simpan di /src/lib/calendar/ dan test dengan Vitest. Jangan pernah hardcode tanggal spesifik di komponen UI.


2. Struktur Direktori

Penting
Buat struktur ini SEBELUM menulis satu baris kode komponen. Struktur yang benar mencegah refactor besar nantinya.

Root Structure
  kalenderislam-id/  ├── src/  │   ├── pages/              ← Astro routing (semua URL ada di sini)  │   ├── components/         ← Astro + Preact components  │   ├── layouts/            ← Layout templates  │   ├── lib/                ← Core algorithms (NO UI dependency)  │   ├── data/               ← Static JSON data files  │   ├── styles/             ← Global CSS + Tailwind config  │   └── content/            ← Astro Content Collections (hari besar deskripsi)  ├── public/                 ← Static assets (favicon, robots.txt)  ├── astro.config.mjs  ├── tailwind.config.mjs  ├── tsconfig.json  └── vitest.config.ts

src/pages/ — URL Routing
  src/pages/  ├── index.astro                         → /  ├── kalender/  │   ├── [tahun].astro                   → /kalender/2026  │   └── [tahun]/[bulan].astro           → /kalender/2026/maret  ├── ramadan/  │   ├── [tahun].astro                   → /ramadan/2026  │   └── [tahun]/[kota].astro            → /ramadan/2026/jakarta  ├── sholat/  │   └── [kota].astro                    → /sholat/jakarta  ├── hari-besar/  │   └── [event]/[tahun].astro           → /hari-besar/idul-fitri/2026  ├── kalender-jawa/  │   └── [tahun].astro                   → /kalender-jawa/2026  ├── libur-nasional/  │   └── [tahun].astro                   → /libur-nasional/2026  ├── konversi.astro                      → /konversi  ├── weton.astro                         → /weton  └── api/      ├── hijri.ts                        → /api/hijri (Cloudflare Worker)      └── og/[...slug].ts                 → /api/og/... (OG image generator)

src/lib/ — Core Algorithms (PENTING: no UI imports)
  src/lib/  ├── calendar/  │   ├── hijri.ts              ← gregorianToHijri(), hijriToGregorian()  │   ├── jawa.ts               ← gregorianToJawa(), getWeton(), getNeptu()  │   ├── prayer.ts             ← getPrayerTimes(lat, lng, date, method)  │   ├── holidays.ts           ← getNationalHolidays(year)  │   └── index.ts              ← re-export semua  ├── seo/  │   ├── metadata.ts           ← generateMetadata(pageType, params)  │   └── jsonld.ts             ← generateJsonLD(type, data)  └── supabase.ts               ← client Supabase (hanya server-side)

src/data/ — Static JSON
  src/data/  ├── kota.json                 ← 100+ kota: {name, slug, lat, lng, timezone, method}  ├── hari-besar.json           ← 9 hari besar: {slug, hijriMonth, hijriDay, nama, ...}  ├── provinsi.json             ← 34 provinsi + kota-kota utama  └── prayer-methods.json       ← Metode perhitungan sholat Kemenag & lainnya

src/components/
  src/components/  ├── calendar/  │   ├── CalendarGrid.astro         ← Grid 7 kolom, render di server  │   ├── CalendarHeader.astro       ← Month/year nav + Hijri label  │   └── DayDetail.astro            ← Modal/panel detail per hari  ├── islands/                       ← SEMUA file di sini punya client: directive  │   ├── TodayWidget.tsx            ← Real-time tanggal hari ini (client:load)  │   ├── DateConverter.tsx          ← Triple converter interaktif (client:idle)  │   ├── WetonCalculator.tsx        ← Kalkulator weton (client:idle)  │   ├── Countdown.tsx              ← Countdown ke event (client:visible)  │   ├── PrayerTimes.tsx            ← Jadwal sholat + geolocation (client:idle)  │   └── NotifBanner.tsx            ← Push notification opt-in (client:idle)  ├── seo/  │   ├── MetaTags.astro             ← <head> SEO tags  │   └── JsonLD.astro               ← Inject structured data  └── ui/      ├── Button.astro      ├── Badge.astro      └── ...shared UI components


3. Calendar Algorithms

Kritis
Algoritma ini adalah INTI dari seluruh produk. Harus ditulis dengan teliti, memiliki unit test komprehensif, dan TIDAK boleh diubah tanpa menjalankan seluruh test suite.

3.1 Gregorian → Hijri (Umm al-Qura Method)
File: src/lib/calendar/hijri.ts

  // Types  export interface HijriDate {    day: number;    month: number;          // 1–12    year: number;    monthName: string;      // 'Muharram', 'Safar', ...    monthNameShort: string; // 'Muh', 'Saf', ...  }    export const HIJRI_MONTHS = [    'Muharram','Safar','Rabiul Awal','Rabiul Akhir',    'Jumadil Awal','Jumadil Akhir','Rajab','Syaban',    'Ramadan','Syawal','Dzulqaidah','Dzulhijjah'  ];    export function gregorianToHijri(date: Date): HijriDate {    const jdn = toJulianDayNumber(date);    const l   = jdn - 1948440 + 10632;    const n   = Math.floor((l - 1) / 10631);    const l2  = l - 10631 * n + 354;    const j   = Math.floor((10985 - l2) / 5316) *                Math.floor(50 * l2 / 17719) +                Math.floor(l2 / 5670) *                Math.floor(43 * l2 / 15238);    const l3  = l2 - Math.floor((30 - j) / 15) *                Math.floor(17719 * j / 50) -                Math.floor(j / 16) *                Math.floor(15238 * j / 43) + 29;    const month = Math.floor(24 * l3 / 709);    const day   = l3 - Math.floor(709 * month / 24);    const year  = 30 * n + j - 30;    return { day, month, year,             monthName: HIJRI_MONTHS[month - 1],             monthNameShort: HIJRI_MONTHS[month-1].slice(0,3) };  }    function toJulianDayNumber(date: Date): number {    const y = date.getFullYear();    const m = date.getMonth() + 1;    const d = date.getDate();    // Gregorian to JDN    const a = Math.floor((14 - m) / 12);    const yy = y + 4800 - a;    const mm = m + 12 * a - 3;    return d + Math.floor((153*mm+2)/5) + 365*yy +           Math.floor(yy/4) - Math.floor(yy/100) +           Math.floor(yy/400) - 32045;  }

3.2 Gregorian → Kalender Jawa
File: src/lib/calendar/jawa.ts

  export interface JawaDate {    pasaran: string;   // 'Kliwon'|'Legi'|'Pahing'|'Pon'|'Wage'    hariJawa: string;  // 'Ahad'|'Senen'|'Selasa'|'Rebo'|'Kemis'|'Jumah'|'Setu'    neptu: number;     // 5–18    weton: string;     // 'Jumat Kliwon', dll.  }    const PASARAN      = ['Kliwon','Legi','Pahing','Pon','Wage'] as const;  const HARI_JAWA    = ['Ahad','Senen','Selasa','Rebo','Kemis','Jumah','Setu'];  const NEPTU_HARI   = [5, 4, 3, 7, 8, 6, 9];   // Sun=5, Mon=4, ..., Sat=9  const NEPTU_PASAR  = [8, 5, 9, 7, 4];          // Kliwon=8, Legi=5, Pahing=9, Pon=7, Wage=4    // Epoch: Senin Pahing = 15 Maret 1633 M (awal siklus Kalender Jawa Sultan Agung)  const EPOCH = new Date(1633, 2, 15); // bulan 0-indexed    export function gregorianToJawa(date: Date): JawaDate {    const msPerDay  = 86_400_000;    const daysDiff  = Math.floor((date.getTime() - EPOCH.getTime()) / msPerDay);    const pasaranIdx = ((daysDiff % 5) + 5) % 5;    const dayOfWeek  = date.getDay(); // 0=Minggu    const neptu      = NEPTU_HARI[dayOfWeek] + NEPTU_PASAR[pasaranIdx];    const pasaran    = PASARAN[pasaranIdx];    const hariJawa   = HARI_JAWA[dayOfWeek];    return { pasaran, hariJawa, neptu, weton: `${hariJawa} ${pasaran}` };  }

3.3 Prayer Times
File: src/lib/calendar/prayer.ts — menggunakan adhan-js

  import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';    export interface SholatTimes {    fajr: Date; sunrise: Date; dhuhr: Date;    asr: Date; maghrib: Date; isha: Date;  }    export function getPrayerTimes(lat: number, lng: number, date: Date): SholatTimes {    const coordinates = new Coordinates(lat, lng);    // Metode Kemenag Indonesia = MuslimWorldLeague dengan Fajr 20°, Isha 18°    const params = CalculationMethod.MuslimWorldLeague();    params.fajrAngle = 20;    params.ishaAngle = 18;    params.madhab = Madhab.Shafi;  // untuk Asr (mayoritas Indonesia)    const prayerTimes = new PrayerTimes(coordinates, date, params);    return {      fajr: prayerTimes.fajr,      sunrise: prayerTimes.sunrise,      dhuhr: prayerTimes.dhuhr,      asr: prayerTimes.asr,      maghrib: prayerTimes.maghrib,      isha: prayerTimes.isha,    };  }    // Format ke HH:MM WIB/WITA/WIT berdasarkan timezone kota  export function formatSholatTime(date: Date, timezone: string): string {    return date.toLocaleTimeString('id-ID', {      hour: '2-digit', minute: '2-digit',      timeZone: timezone,    });  }

3.4 Unit Test Requirements
Wajib
Semua fungsi di src/lib/calendar/ HARUS memiliki unit test dengan Vitest sebelum digunakan di halaman. Target coverage: 100% untuk fungsi kalender.

File: src/lib/calendar/__tests__/hijri.test.ts — Minimum test cases:
Input (Tanggal Masehi)
Expected Output (Hijri)
Catatan
1 Januari 2026
12 Rajab 1447 H
Awal tahun 2026
19 Februari 2026
1 Ramadan 1447 H
Crosscheck Kemenag
20 Maret 2026
1 Syawal 1447 H
Idul Fitri (prediksi)
27 Mei 2026
1 Dzulhijjah 1447 H
Idul Adha (prediksi)
16 Juni 2026
1 Muharram 1448 H
Tahun Baru Islam
1 Januari 2030
1 Rajab 1451 H
Verifikasi tahun jauh
15 Maret 1633
1 Muharram 1043 H
Epoch historis

File: src/lib/calendar/__tests__/jawa.test.ts — Minimum test cases:
Input (Tanggal Masehi)
Expected Pasaran
Expected Neptu
15 Maret 1633 (Epoch)
Pahing
14 (Senen=4 + Pahing=9 = 13... verifikasi dengan referensi)
Hari ini (saat build)
Verifikasi manual
Crosscheck dengan kalender Jawa fisik
1 Januari 2026
[verifikasi]
[verifikasi]
17 Agustus 2026
[verifikasi]
[verifikasi]
Cara Verifikasi
Gunakan 3 referensi: (1) primbon.com, (2) kalender Jawa fisik yang tersedia, (3) rukyat.or.id. Jika ada perbedaan antar referensi, gunakan mayoritas 2 dari 3.


4. Astro Pages & getStaticPaths()

4.1 Konfigurasi Dasar
  // astro.config.mjs  import { defineConfig } from 'astro/config';  import tailwind from '@astrojs/tailwind';  import preact from '@astrojs/preact';  import cloudflare from '@astrojs/cloudflare';  import sitemap from '@astrojs/sitemap';    export default defineConfig({    output: 'static',       // PENTING: semua halaman jadi static HTML    adapter: cloudflare(),  // untuk API routes di Cloudflare Workers    site: 'https://kalenderislam.id',    integrations: [      tailwind(),      preact(),              // untuk Islands (Preact lebih ringan dari React)      sitemap({        changefreq: 'monthly',        priority: 0.7,        lastmod: new Date(),      }),    ],    prefetch: true,         // prefetch halaman berikutnya  });

4.2 Pattern getStaticPaths()
Semua halaman programmatic menggunakan pattern ini:
  // src/pages/kalender/[tahun].astro  ---  import { gregorianToHijri, generateMonthCalendar } from '@/lib/calendar';  import { getNationalHolidays } from '@/lib/calendar/holidays';  import { getKemenagOfficialDates } from '@/lib/supabase';  import KalenderLayout from '@/layouts/KalenderLayout.astro';    export async function getStaticPaths() {    const tahunRange = Array.from({ length: 9 }, (_, i) => 2024 + i); // 2024–2032    return tahunRange.map(tahun => ({      params: { tahun: String(tahun) },      props:  { tahun },    }));  }    const { tahun } = Astro.props;    // Semua kalkulasi di server — 0 JS dikirim ke browser untuk data ini  const calendarData  = generateYearCalendar(tahun);  const hariLibur     = await getNationalHolidays(tahun);    // Supabase  const officialDates = await getKemenagOfficialDates(tahun); // Supabase  ---    <KalenderLayout tahun={tahun} ...>    <CalendarGrid data={calendarData} holidays={hariLibur} official={officialDates} />    <!-- Islands: hanya komponen yg butuh JS -->    <TodayWidget client:load />    <Countdown targetDate={officialDates.ramadan} client:visible />  </KalenderLayout>

4.3 Rentang Tahun per Halaman Type
Halaman
Rentang Tahun
Alasan
/kalender/[tahun]
2024–2032
Cukup untuk 5+ tahun ke depan; tambah mudah
/ramadan/[tahun]
2025–2033
Ramadan selalu dicari 1 tahun ke depan
/ramadan/[tahun]/[kota]
2025–2028
100 kota × 4 tahun = 400 halaman; tambah manual kalau perlu
/hari-besar/[event]/[tahun]
2024–2031
8 event × 8 tahun = 64 halaman
/kalender-jawa/[tahun]
2024–2032
Sama dengan kalender utama
/libur-nasional/[tahun]
2024–2030
Data SKB tersedia max 1 tahun ke depan


5. Data Layer

5.1 Supabase Schema
  -- Tabel 1: Hasil sidang isbat dan tanggal resmi  CREATE TABLE official_dates (    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),    event            text NOT NULL,  -- 'ramadan_start'|'idul_fitri'|'idul_adha'|                                     --  'isra_miraj'|'maulid_nabi'|'muharram'    tahun_masehi     integer NOT NULL,    tanggal_resmi    date,            -- NULL = belum ada isbat resmi    tanggal_muhammadiyah date,        -- Hisab Muhammadiyah (dari data statis)    tanggal_perkiraan    date,        -- Dari algoritma Hijri (fallback)    catatan          text,    updated_at       timestamptz DEFAULT now(),    UNIQUE(event, tahun_masehi)  );    -- Tabel 2: Hari libur nasional dari SKB 3 Menteri  CREATE TABLE national_holidays (    tanggal    date PRIMARY KEY,    nama       text NOT NULL,    tipe       text NOT NULL,  -- 'libur_nasional' | 'cuti_bersama'    agama      text,           -- 'islam' | 'kristen' | 'hindu' | 'nasional' | null    created_at timestamptz DEFAULT now()  );    -- Tabel 3: Push notification subscribers  CREATE TABLE push_subscribers (    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),    fcm_token     text UNIQUE NOT NULL,    events        text[] DEFAULT '{}',  -- ['ramadan','idul_fitri','idul_adha']    kota_slug     text,    created_at    timestamptz DEFAULT now()  );    -- Row Level Security  ALTER TABLE official_dates     ENABLE ROW LEVEL SECURITY;  ALTER TABLE national_holidays  ENABLE ROW LEVEL SECURITY;  ALTER TABLE push_subscribers   ENABLE ROW LEVEL SECURITY;    -- Public read untuk official_dates & national_holidays  CREATE POLICY 'public_read' ON official_dates     FOR SELECT USING (true);  CREATE POLICY 'public_read' ON national_holidays  FOR SELECT USING (true);  -- push_subscribers: hanya bisa insert/update token sendiri  CREATE POLICY 'self_insert' ON push_subscribers FOR INSERT WITH CHECK (true);

5.2 src/data/kota.json — Format
  [    {      "slug": "jakarta",      "name": "Jakarta",      "province": "DKI Jakarta",      "lat": -6.2088,      "lng": 106.8456,      "timezone": "Asia/Jakarta",  // "Asia/Makassar" untuk WITA, "Asia/Jayapura" untuk WIT      "elevation": 8               // meter, untuk koreksi waktu sholat    },    // ... 100+ kota lainnya  ]

5.3 src/data/hari-besar.json — Format
  [    {      "slug": "idul-fitri",      "nama": "Hari Raya Idul Fitri",      "nama_arab": "عيد الفطر",      "hijriMonth": 10,      "hijriDay": 1,      "libur_nasional": true,      "deskripsi": "Hari raya yang menandai berakhirnya bulan Ramadan.",      "amalan": ["Takbiran", "Shalat Id", "Silaturahmi", "Zakat Fitrah"],      "event_id": "idul_fitri"  // key untuk lookup official_dates di Supabase    },  ]


6. SEO Implementation

6.1 generateMetadata() Helper
  // src/lib/seo/metadata.ts  interface MetaProps {    title: string;    description: string;    canonicalPath: string;    ogImagePath?: string;  }    export function generateMetadata(type: string, params: Record<string,string>): MetaProps {    const base = 'KalenderIslam.id';    const templates: Record<string, MetaProps> = {      'kalender-tahun': {        title: `Kalender Islam ${params.tahun} Lengkap - Hijriah, Masehi & Jawa | ${base}`,        description: `Kalender Islam ${params.tahun} resmi dari Kemenag RI. Lengkap dengan ` +          `penanggalan Hijriah, Jawa, hari libur nasional, dan jadwal sholat.`,        canonicalPath: `/kalender/${params.tahun}`,        ogImagePath: `/api/og/kalender-${params.tahun}`,      },      'hari-besar': {        title: `${params.namaEvent} ${params.tahun} - Tanggal & Countdown | ${base}`,        description: `${params.namaEvent} ${params.tahun} jatuh tanggal berapa? ` +          `Tanggal resmi Kemenag, versi Muhammadiyah, dan countdown hari. Update otomatis.`,        canonicalPath: `/hari-besar/${params.slug}/${params.tahun}`,        ogImagePath: `/api/og/hari-besar-${params.slug}-${params.tahun}`,      },      // ... template untuk semua page type    };    return templates[type] ?? { title: base, description: '', canonicalPath: '/' };  }

6.2 JSON-LD Structured Data
Setiap halaman hari besar HARUS memiliki Event schema:
  {    "@context": "https://schema.org",    "@type": "Event",    "name": "Hari Raya Idul Fitri 2026",    "startDate": "2026-03-20",           // tanggal_resmi dari Supabase, fallback ke perkiraan    "endDate": "2026-03-21",    "eventStatus": "EventScheduled",    "eventAttendanceMode": "OfflineEventAttendanceMode",    "location": {      "@type": "Place",      "name": "Indonesia",      "address": { "@type": "PostalAddress", "addressCountry": "ID" }    },    "organizer": {      "@type": "GovernmentOrganization",      "name": "Kementerian Agama Republik Indonesia",      "url": "https://kemenag.go.id"    },    "description": "Hari raya yang menandai berakhirnya bulan Ramadan 1447 H."  }

Halaman berisi FAQ tentang tanggal HARUS memiliki FAQPage schema:
  {    "@context": "https://schema.org",    "@type": "FAQPage",    "mainEntity": [{      "@type": "Question",      "name": "Idul Fitri 2026 jatuh tanggal berapa?",      "acceptedAnswer": {        "@type": "Answer",        "text": "Idul Fitri 2026 (1 Syawal 1447 H) diperkirakan jatuh pada 20-21 Maret 2026.                 Tanggal pasti menunggu hasil sidang isbat Kemenag RI."      }    }]  }

6.3 Sitemap Configuration
  // astro.config.mjs — sitemap dengan priority kustom  sitemap({    customPages: ['https://kalenderislam.id/konversi', 'https://kalenderislam.id/weton'],    serialize(item) {      // Homepage: priority 1.0      if (item.url === 'https://kalenderislam.id/') {        return { ...item, priority: 1.0, changefreq: 'daily' };      }      // Hari besar tahun ini: priority 0.9      if (item.url.includes('/hari-besar/') && item.url.includes('/2026')) {        return { ...item, priority: 0.9, changefreq: 'monthly' };      }      // Kalender tahun ini: priority 0.8      if (item.url.includes('/kalender/2026') || item.url.includes('/ramadan/2026')) {        return { ...item, priority: 0.8, changefreq: 'monthly' };      }      // Default: priority 0.6      return { ...item, priority: 0.6, changefreq: 'yearly' };    },  })


7. API Routes (Cloudflare Workers)

7.1 GET /api/hijri
  // src/pages/api/hijri.ts  import type { APIRoute } from 'astro';  import { gregorianToHijri } from '@/lib/calendar/hijri';    export const GET: APIRoute = ({ request }) => {    const url    = new URL(request.url);    const dateStr = url.searchParams.get('date');  // format: YYYY-MM-DD      if (!dateStr) {      return new Response(JSON.stringify({ error: 'Parameter ?date=YYYY-MM-DD diperlukan' }),        { status: 400, headers: { 'Content-Type': 'application/json' } });    }      const date = new Date(dateStr + 'T12:00:00Z');    if (isNaN(date.getTime())) {      return new Response(JSON.stringify({ error: 'Format tanggal tidak valid' }),        { status: 400, headers: { 'Content-Type': 'application/json' } });    }      const hijri = gregorianToHijri(date);    return new Response(JSON.stringify({      gregorian: dateStr,      hijri: { day: hijri.day, month: hijri.month, year: hijri.year, monthName: hijri.monthName },      formatted: `${hijri.day} ${hijri.monthName} ${hijri.year} H`,    }), {      status: 200,      headers: {        'Content-Type': 'application/json',        'Cache-Control': 'public, max-age=86400',  // cache 24 jam        'Access-Control-Allow-Origin': '*',          // public API      }    });  };

Endpoint
Method
Parameter
Response
Cache
/api/hijri
GET
?date=YYYY-MM-DD
JSON: {gregorian, hijri, formatted}
24 jam
/api/jawa
GET
?date=YYYY-MM-DD
JSON: {gregorian, jawa: {pasaran, hariJawa, neptu, weton}}
24 jam
/api/sholat
GET
?kota=jakarta&date=YYYY-MM-DD
JSON: {kota, date, times: {fajr,dhuhr,asr,maghrib,isha}}
24 jam
/api/hari-besar
GET
?tahun=2026
JSON: array hari besar + tanggal resmi
1 jam


8. Performance & Deployment

8.1 Performance Budget
Aset
Budget Maksimum
Cara Ukur
JavaScript bundle (per halaman statis)
0KB (zero JS untuk static pages)
Chrome DevTools Network tab, filter JS
JavaScript bundle (halaman dengan Islands)
< 25KB gzip
Bundlesize CI check
CSS bundle
< 15KB gzip
Tailwind purge + gzip
Total page weight (homepage)
< 200KB
Lighthouse
Gambar (thumbnail/icon)
< 20KB per gambar
imagemin + WebP/AVIF
OG image (generatif)
< 100KB
Satori output size
Font loading
Font display: swap, preload kritis
Lighthouse font audit

8.2 Cloudflare Pages Deployment
  # Build command  npm run build    # Output directory  dist/    # Environment variables (set di Cloudflare Pages dashboard)  SUPABASE_URL=https://[project].supabase.co  SUPABASE_ANON_KEY=[key]  PUBLIC_SITE_URL=https://kalenderislam.id    # wrangler.toml — untuk Cloudflare Workers (API routes)  [vars]  ENVIRONMENT = 'production'    [[kv_namespaces]]  binding = 'CACHE'  id = '[kv-namespace-id]'

8.3 Deployment Checklist (sebelum setiap deploy)
npm run build berhasil tanpa error atau warning TypeScript
npm run test (Vitest) lulus 100% — terutama unit test algoritma kalender
Lighthouse score ≥ 90 untuk halaman utama (/kalender/[tahun], /ramadan/[tahun])
Validate structured data di: search.google.com/test/rich-results
Cek sitemap.xml tersedia di /sitemap-index.xml
Verifikasi tanggal Hijri hari ini di homepage akurat vs Kemenag
Test di Chrome mobile emulation 375px — tidak ada overflow
Test konverter: input 1 Januari 2026 → output 12 Rajab 1447 H


9. Sprint Execution Guide

Untuk Dev Agent
Ikuti urutan sprint ini secara ketat. JANGAN melanjutkan ke sprint berikutnya jika sprint sebelumnya belum selesai dan unit test belum lulus 100%.

Sprint
Minggu
Task Utama
Definition of Done
S-01
1
Setup project: Astro + TS + Tailwind + Cloudflare adapter. Buat struktur direktori sesuai Section 2.
npm run dev berjalan. Struktur direktori lengkap. tsconfig strict mode aktif.
S-02
1–2
Implementasi algoritma: hijri.ts, jawa.ts, prayer.ts. Tulis unit test Vitest.
npm run test lulus 100%. Akurasi Hijri dan Jawa terverifikasi vs referensi.
S-03
2
Supabase setup: buat 3 tabel sesuai schema Section 5.1. Seed data awal libur nasional 2025–2027.
Query getKemenagOfficialDates(2026) dan getNationalHolidays(2026) return data benar.
S-04
3
Homepage + /kalender/[tahun] + /kalender/[tahun]/[bulan] dengan ISR.
Semua halaman 2024–2032 render tanpa error. LCP < 2.0s. Mobile 375px OK.
S-05
3–4
Islands: TodayWidget + DateConverter + WetonCalculator. Semua di src/components/islands/.
Konverter akurat. Weton akurat. 0 error console. Bundle islands < 25KB.
S-06
4–5
Halaman /hari-besar/[event]/[tahun] + /libur-nasional/[tahun]. JSON-LD Event schema.
Rich Results Test valid untuk semua halaman hari besar. FAQ schema OK.
S-07
5–6
/ramadan/[tahun] + /ramadan/[tahun]/[kota] (100 kota × 4 tahun). PDF download.
400 halaman imsakiyah render benar. Waktu sholat akurat ±2 menit. PDF A4 OK.
S-08
6–7
/sholat/[kota] + Countdown Islands + API routes /api/hijri, /api/jawa, /api/sholat.
API return 200 dengan JSON correct. Geolocation fallback ke Jakarta jika ditolak.
S-09
7
SEO audit: metadata semua halaman, sitemap, robots.txt, OG image generatif.
Lighthouse SEO score 100. Sitemap mengandung semua URL. Semua OG image render.
S-10
8
Performance audit, cross-browser test, soft launch ke komunitas Muslim Indonesia.
Core Web Vitals semua "Good" di GSC. Lighthouse ≥ 95 mobile. Tidak ada bug kritis.



KalenderIslam.id — Tech Spec v1.0
Baca bersama PRD v1.0. Pertanyaan teknis → tanyakan sebelum coding, bukan sesudah.