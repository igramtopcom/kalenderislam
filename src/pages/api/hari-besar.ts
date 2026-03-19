import type { APIRoute } from 'astro';
import { getAllHariBesar } from '@/lib/data';

export const prerender = false;

const CORS = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' };

export const GET: APIRoute = ({ request }) => {
  const url   = new URL(request.url);
  const tahun = parseInt(url.searchParams.get('tahun') ?? String(new Date().getFullYear()));

  if (isNaN(tahun) || tahun < 2024 || tahun > 2032) {
    return new Response(JSON.stringify({ error: 'Parameter ?tahun harus antara 2024–2032' }), { status: 400, headers: CORS });
  }

  const list = getAllHariBesar();
  return new Response(JSON.stringify({
    tahun,
    events: list.map(h => ({
      slug: h.slug, nama: h.nama, hijriMonth: h.hijriMonth, hijriDay: h.hijriDay,
      libur_nasional: h.libur_nasional, page_url: `https://kalenderislam.id/hari-besar/${h.slug}/${tahun}`,
    })),
    meta: { note: 'Untuk tanggal Masehi lengkap, gunakan halaman /hari-besar/[event]/[tahun].' },
  }), { status: 200, headers: CORS });
};
