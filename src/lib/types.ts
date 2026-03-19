export interface Kota {
  slug: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  timezone: string;
  elevation: number;
}

export interface HariBesar {
  slug: string;
  nama: string;
  nama_arab: string;
  hijriMonth: number;
  hijriDay: number;
  libur_nasional: boolean;
  deskripsi: string;
  amalan: string[];
  event_id: string;
}

export interface Provinsi {
  slug: string;
  nama: string;
  kota_utama: string[];
}

export interface PrayerMethod {
  id: string;
  nama: string;
  deskripsi: string;
  fajrAngle: number;
  ishaAngle: number;
  madhab: 'shafi' | 'hanafi';
  isDefault: boolean;
}
