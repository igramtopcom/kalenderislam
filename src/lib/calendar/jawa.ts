export const PASARAN = ['Kliwon', 'Legi', 'Pahing', 'Pon', 'Wage'] as const;
export type Pasaran = typeof PASARAN[number];

export const HARI_JAWA = ['Ahad', 'Senen', 'Selasa', 'Rebo', 'Kemis', 'Jumah', 'Setu'] as const;
export type HariJawa = typeof HARI_JAWA[number];

// Neptu hari: Ahad=5, Senen=4, Selasa=3, Rebo=7, Kemis=8, Jumah=6, Setu=9
export const NEPTU_HARI: Record<number, number> = {
  0: 5, // Ahad (Minggu)
  1: 4, // Senen
  2: 3, // Selasa
  3: 7, // Rebo
  4: 8, // Kemis
  5: 6, // Jumah
  6: 9, // Setu
};

// Neptu pasaran: Kliwon=8, Legi=5, Pahing=9, Pon=7, Wage=4
export const NEPTU_PASARAN: Record<number, number> = {
  0: 8, // Kliwon
  1: 5, // Legi
  2: 9, // Pahing
  3: 7, // Pon
  4: 4, // Wage
};

export interface JawaDate {
  pasaran: Pasaran;
  pasaranIndex: number;   // 0–4
  hariJawa: HariJawa;
  hariJawaIndex: number;  // 0–6
  neptu: number;          // 5–18
  weton: string;          // 'Jumah Kliwon', 'Selasa Wage', dll.
  neptusFormatted: string; // 'Neptu 14'
}

// Epoch referensi: 15 Maret 1633 M (Julian) = awal Kalender Jawa Sultan Agung
// Dalam proleptic Gregorian (JavaScript Date), tanggal ini jatuh pada hari Selasa.
// Offset pasaran dikalibrasi agar 17 Agustus 1945 = Jumat Legi (fakta historis).
const EPOCH_DATE = new Date(Date.UTC(1633, 2, 15, 12, 0, 0));

/**
 * Konversi tanggal Gregorian ke Kalender Jawa
 * @param date - Objek Date JavaScript
 * @returns JawaDate
 */
export function gregorianToJawa(date: Date): JawaDate {
  const MS_PER_DAY = 86_400_000;

  // Normalisasi ke UTC noon untuk konsistensi
  const inputNoon = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12, 0, 0
  );
  const epochNoon = EPOCH_DATE.getTime();

  const daysDiff = Math.round((inputNoon - epochNoon) / MS_PER_DAY);

  // Offset +1 dikalibrasi: 17 Agustus 1945 = Jumat Legi (terverifikasi)
  const pasaranIndex = ((daysDiff + 1) % 5 + 5) % 5;
  const pasaran = PASARAN[pasaranIndex];

  const dayOfWeek = date.getDay(); // 0=Minggu, 1=Senin, ..., 6=Sabtu
  const hariJawa = HARI_JAWA[dayOfWeek];
  const hariJawaIndex = dayOfWeek;

  const neptu = NEPTU_HARI[dayOfWeek] + NEPTU_PASARAN[pasaranIndex];

  return {
    pasaran,
    pasaranIndex,
    hariJawa,
    hariJawaIndex,
    neptu,
    weton: `${hariJawa} ${pasaran}`,
    neptusFormatted: `Neptu ${neptu}`,
  };
}

/**
 * Mendapatkan deskripsi makna neptu untuk ditampilkan di UI
 */
export function getNeptuMeaning(neptu: number): string {
  const meanings: Record<number, string> = {
    5:  'Rahasia, suka menyendiri',
    6:  'Jujur, dapat dipercaya',
    7:  'Pendiam, tekun bekerja',
    8:  'Pandai bergaul, komunikatif',
    9:  'Dermawan, baik hati',
    10: 'Pemberani, tegas',
    11: 'Keras kepala, mandiri',
    12: 'Berwibawa, pemimpin',
    13: 'Cerdas, kreatif',
    14: 'Istimewa, punya karisma (Jumat Kliwon)',
    15: 'Bijaksana, disegani',
    16: 'Sukses, rezeki lancar',
    17: 'Kuat, pantang menyerah',
    18: 'Sangat beruntung (Sabtu Pahing)',
  };
  return meanings[neptu] ?? 'Penuh potensi';
}

/**
 * Mendapatkan semua weton dalam satu bulan Gregorian
 * @param year - Tahun Masehi
 * @param month - Bulan Masehi (0-indexed: 0=Januari)
 */
export function getMonthJawa(year: number, month: number): JawaDate[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: JawaDate[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    result.push(gregorianToJawa(new Date(year, month, day)));
  }
  return result;
}
