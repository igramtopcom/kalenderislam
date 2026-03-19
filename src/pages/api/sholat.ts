import type { APIRoute } from 'astro';
import { getSholatTimesFormatted, getTimezoneLabel } from '@/lib/calendar/prayer';
import { getKotaBySlug } from '@/lib/data';

export const prerender = false;

const CORS = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' };

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const kotaSlug = url.searchParams.get('kota');
  const dateStr  = url.searchParams.get('date');

  if (!kotaSlug) return new Response(JSON.stringify({ error: 'Parameter ?kota=jakarta diperlukan', example: '/api/sholat?kota=jakarta&date=2026-03-19' }), { status: 400, headers: CORS });

  const kota = getKotaBySlug(kotaSlug);
  if (!kota) return new Response(JSON.stringify({ error: `Kota '${kotaSlug}' tidak ditemukan`, hint: 'Gunakan slug: jakarta, surabaya, bandung, dll.' }), { status: 404, headers: CORS });

  const targetDate = dateStr ? new Date(dateStr + 'T12:00:00') : new Date();
  if (isNaN(targetDate.getTime())) return new Response(JSON.stringify({ error: 'Format tanggal: YYYY-MM-DD' }), { status: 400, headers: CORS });

  const times = getSholatTimesFormatted(kota.lat, kota.lng, targetDate, kota.timezone);
  return new Response(JSON.stringify({
    kota: { slug: kota.slug, name: kota.name, province: kota.province, lat: kota.lat, lng: kota.lng, timezone: kota.timezone, tzLabel: getTimezoneLabel(kota.timezone) },
    date: targetDate.toISOString().split('T')[0],
    times: { imsak: times.imsak, fajr: times.fajr, sunrise: times.sunrise, dhuhr: times.dhuhr, asr: times.asr, maghrib: times.maghrib, isha: times.isha },
    meta: { method: 'Kemenag Indonesia (Fajr 20°, Isha 18°, Madhab Shafi)', imsak: 'Fajr - 10 menit', accuracy: '±2 menit dari jadwal resmi Kemenag' },
  }), { status: 200, headers: CORS });
};
