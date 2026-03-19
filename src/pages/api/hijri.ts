import type { APIRoute } from 'astro';
import { gregorianToHijri } from '@/lib/calendar/hijri';

export const prerender = false;

const CORS = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' };

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const dateStr = url.searchParams.get('date');

  if (!dateStr) return new Response(JSON.stringify({ error: 'Parameter ?date=YYYY-MM-DD diperlukan' }), { status: 400, headers: CORS });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return new Response(JSON.stringify({ error: 'Format: YYYY-MM-DD' }), { status: 400, headers: CORS });

  const date = new Date(dateStr + 'T12:00:00Z');
  if (isNaN(date.getTime())) return new Response(JSON.stringify({ error: 'Tanggal tidak valid' }), { status: 400, headers: CORS });

  const year = date.getFullYear();
  if (year < 1900 || year > 2099) return new Response(JSON.stringify({ error: 'Tahun harus 1900–2099' }), { status: 400, headers: CORS });

  const hijri = gregorianToHijri(date);
  return new Response(JSON.stringify({
    gregorian: dateStr,
    hijri: { day: hijri.day, month: hijri.month, year: hijri.year, monthName: hijri.monthName, monthNameShort: hijri.monthNameShort, formatted: hijri.formatted, source: hijri.source ?? 'tabular' },
    meta: { accuracy: hijri.source === 'kemenag_official' ? 'Data resmi Kemenag RI' : hijri.source === 'umm_alqura_projection' ? 'Proyeksi Umm al-Qura (~99%)' : 'Algoritma tabular (±1 hari di luar 2024-2032)' },
  }), { status: 200, headers: CORS });
};
