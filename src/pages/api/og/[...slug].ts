import type { APIRoute } from 'astro';
import satori from 'satori';

export const prerender = false;

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  return res.arrayBuffer();
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug ?? '';

  let title    = 'KalenderIslam.id';
  let subtitle = 'Kalender Hijriah, Masehi & Jawa';
  let bgColor  = '#0D3D22';

  if (slug.startsWith('kalender-')) {
    title    = `Kalender Islam ${slug.replace('kalender-', '')}`;
    subtitle = 'Hijriah · Masehi · Jawa · Lengkap';
  } else if (slug.startsWith('hari-besar-')) {
    const parts = slug.replace('hari-besar-', '').split('-');
    const tahun = parts.pop();
    title    = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    subtitle = `${tahun} · KalenderIslam.id`;
    bgColor  = '#062917';
  } else if (slug.startsWith('ramadan-')) {
    title    = `Ramadan ${slug.replace('ramadan-', '')}`;
    subtitle = 'Jadwal Imsakiyah · 100+ Kota Indonesia';
    bgColor  = '#062917';
  }

  try {
    const [loraFont, jakartaFont] = await Promise.all([
      loadFont('https://fonts.gstatic.com/s/lora/v35/0QI6MX1D_JOxE7j-oetL.woff'),
      loadFont('https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg.woff'),
    ]);

    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start', justifyContent: 'space-between',
            background: `linear-gradient(135deg, ${bgColor} 0%, #062917 100%)`,
            padding: '60px', fontFamily: 'Plus Jakarta Sans',
          },
          children: [
            { type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [
              { type: 'div', props: { style: { width: '48px', height: '48px', background: '#155232', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E2BC45', fontSize: '24px' }, children: '☪' } },
              { type: 'span', props: { style: { fontFamily: 'Lora', fontSize: '20px', fontWeight: 600, color: 'white' }, children: 'KalenderIslam.id' } },
            ] } },
            { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, children: [
              { type: 'div', props: { style: { fontFamily: 'Lora', fontSize: '56px', fontWeight: 700, color: 'white', lineHeight: 1.1 }, children: title } },
              { type: 'div', props: { style: { fontSize: '24px', color: '#9FE1CB' }, children: subtitle } },
            ] } },
            { type: 'div', props: { style: { display: 'flex', padding: '12px 20px', background: 'rgba(255,255,255,.08)', borderRadius: '12px', border: '1px solid rgba(255,255,255,.15)' }, children: [
              { type: 'span', props: { style: { fontSize: '18px', color: '#E2BC45', fontWeight: 600 }, children: 'Akurat sesuai Kemenag RI · kalenderislam.id' } },
            ] } },
          ],
        },
      },
      {
        width: 1200, height: 630,
        fonts: [
          { name: 'Lora', data: loraFont, weight: 700, style: 'normal' as const },
          { name: 'Plus Jakarta Sans', data: jakartaFont, weight: 400, style: 'normal' as const },
        ],
      }
    );

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return Response.redirect('https://kalenderislam.id/og-default.png', 302);
  }
};
