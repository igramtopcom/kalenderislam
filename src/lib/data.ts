import type { Kota, HariBesar, Provinsi, PrayerMethod } from './types';
import kotaData from '@/data/kota.json';
import hariBesarData from '@/data/hari-besar.json';
import provinsiData from '@/data/provinsi.json';
import prayerMethodsData from '@/data/prayer-methods.json';

export const getAllKota = (): Kota[] => kotaData as Kota[];

export const getKotaBySlug = (slug: string): Kota | undefined =>
  (kotaData as Kota[]).find(k => k.slug === slug);

export const getAllHariBesar = (): HariBesar[] => hariBesarData as HariBesar[];

export const getHariBesarBySlug = (slug: string): HariBesar | undefined =>
  (hariBesarData as HariBesar[]).find(h => h.slug === slug);

export const getAllProvinsi = (): Provinsi[] => provinsiData as Provinsi[];

export const getDefaultPrayerMethod = (): PrayerMethod =>
  (prayerMethodsData as PrayerMethod[]).find(m => m.isDefault)!;
