import type { APIRoute } from 'astro';
import { gregorianToJawa, getNeptuMeaning } from '@/lib/calendar/jawa';

export const prerender = false;

const CORS = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=86400', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' };

export const GET: APIRoute = ({ request }) => {
  const url = new URL(request.url);
  const dateStr = url.searchParams.get('date');

  if (!dateStr) return new Response(JSON.stringify({ error: 'Parameter ?date=YYYY-MM-DD diperlukan' }), { status: 400, headers: CORS });

  const date = new Date(dateStr + 'T12:00:00Z');
  if (isNaN(date.getTime())) return new Response(JSON.stringify({ error: 'Tanggal tidak valid' }), { status: 400, headers: CORS });

  const jawa = gregorianToJawa(date);
  return new Response(JSON.stringify({
    gregorian: dateStr,
    jawa: { pasaran: jawa.pasaran, pasaranIndex: jawa.pasaranIndex, hariJawa: jawa.hariJawa, hariJawaIndex: jawa.hariJawaIndex, neptu: jawa.neptu, weton: jawa.weton, neptusFormatted: jawa.neptusFormatted, meaning: getNeptuMeaning(jawa.neptu) },
  }), { status: 200, headers: CORS });
};
