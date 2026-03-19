export interface MetaProps {
  title:         string;
  description:   string;
  canonicalPath: string;
  ogImagePath?:  string;
}

const BASE     = 'KalenderIslam.id';
const SITE_URL = 'https://kalenderislam.id';

export function generateMetadata(
  type: string,
  params: Record<string, string> = {}
): MetaProps {
  const templates: Record<string, MetaProps> = {
    'home': {
      title:         `Kalender Islam ${new Date().getFullYear()} — Hijriah, Masehi & Jawa | ${BASE}`,
      description:   'Kalender Islam terlengkap untuk Muslim Indonesia. Hijriah, Masehi, dan Jawa dalam satu tampilan. Akurat sesuai Kemenag RI.',
      canonicalPath: '/',
    },
    'kalender-tahun': {
      title:         `Kalender Islam ${params.tahun} Lengkap — Hijriah, Masehi & Jawa | ${BASE}`,
      description:   `Kalender Islam ${params.tahun} resmi dari Kemenag RI. Lengkap dengan penanggalan Hijriah, Jawa, hari libur nasional, dan jadwal sholat.`,
      canonicalPath: `/kalender/${params.tahun}`,
    },
    'kalender-bulan': {
      title:         `Kalender Islam ${params.bulanCapital} ${params.tahun} — Hijriah & Jawa | ${BASE}`,
      description:   `Kalender Islam ${params.bulanCapital} ${params.tahun} lengkap dengan tanggal Hijriah, Jawa, dan hari libur. Akurat sesuai Kemenag RI.`,
      canonicalPath: `/kalender/${params.tahun}/${params.bulan}`,
    },
    'kalender-jawa': {
      title:         `Kalender Jawa ${params.tahun} Lengkap — Weton & Pasaran | ${BASE}`,
      description:   `Kalender Jawa ${params.tahun} lengkap dengan nama hari, pasaran (Kliwon, Legi, Pahing, Pon, Wage), weton, dan neptu setiap hari.`,
      canonicalPath: `/kalender-jawa/${params.tahun}`,
    },
    'hari-besar': {
      title:         `${params.namaEvent} ${params.tahun} — Tanggal & Countdown | ${BASE}`,
      description:   `${params.namaEvent} ${params.tahun} jatuh tanggal berapa? Tanggal resmi Kemenag, versi Muhammadiyah, dan countdown hari.`,
      canonicalPath: `/hari-besar/${params.slug}/${params.tahun}`,
    },
    'libur-nasional': {
      title:         `Hari Libur Nasional ${params.tahun} — Tanggal Merah & Cuti Bersama | ${BASE}`,
      description:   `Daftar lengkap hari libur nasional dan cuti bersama ${params.tahun} berdasarkan SKB 3 Menteri Republik Indonesia.`,
      canonicalPath: `/libur-nasional/${params.tahun}`,
    },
    'sholat-kota': {
      title:         `Jadwal Sholat ${params.namaKota} Hari Ini — Waktu 5 Waktu | ${BASE}`,
      description:   `Jadwal sholat ${params.namaKota} hari ini lengkap: Subuh, Dzuhur, Ashar, Maghrib, Isya. Akurat sesuai metode Kemenag Indonesia.`,
      canonicalPath: `/sholat/${params.slug}`,
    },
    'konversi': {
      title:         `Konverter Tanggal Hijriah, Masehi & Jawa | ${BASE}`,
      description:   'Konversi tanggal Masehi ke Hijriah dan Jawa secara instan. Cari tahu weton, neptu, dan pasaran untuk tanggal lahir Anda.',
      canonicalPath: '/konversi',
    },
    'weton': {
      title:         `Kalkulator Weton Jawa — Hitung Weton & Neptu Tanggal Lahir | ${BASE}`,
      description:   'Hitung weton Jawa dari tanggal lahir. Temukan hari pasaran, neptu, dan maknanya. Kalkulator weton online terpercaya.',
      canonicalPath: '/weton',
    },
  };

  return templates[type] ?? {
    title: BASE,
    description: 'Kalender Islam terlengkap untuk Muslim Indonesia.',
    canonicalPath: '/',
  };
}

export function generateBreadcrumbLD(
  items: Array<{ name: string; url: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export const websiteLD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BASE,
  url: SITE_URL,
  description: 'Kalender Islam terlengkap untuk Muslim Indonesia',
  inLanguage: 'id-ID',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/konversi?tanggal={date}`,
    },
    'query-input': 'required name=date',
  },
};
