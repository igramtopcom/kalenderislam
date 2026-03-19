const SITE_URL = 'https://kalenderislam.id';

const PAGES = [
  '/', '/kalender/2026', '/kalender/2026/maret', '/ramadan/2026',
  '/ramadan/2026/jakarta', '/hari-besar/idul-fitri/2026',
  '/hari-besar/idul-adha/2026', '/libur-nasional/2026',
  '/kalender-jawa/2026', '/sholat/jakarta', '/konversi', '/weton',
];

async function auditPage(path: string) {
  const url = `${SITE_URL}${path}`;
  const issues: string[] = [];

  try {
    const res = await fetch(url);
    const html = await res.text();

    const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? null;
    const desc  = html.match(/<meta name="description" content="(.*?)"/)?.[1] ?? null;
    const canon = html.match(/<link rel="canonical" href="(.*?)"/)?.[1] ?? null;
    const ogT   = html.match(/<meta property="og:title" content="(.*?)"/)?.[1] ?? null;
    const ogI   = html.match(/<meta property="og:image" content="(.*?)"/)?.[1] ?? null;
    const hre   = html.match(/<link rel="alternate" hreflang="(.*?)"/)?.[1] ?? null;

    const jsonld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      .map(m => { try { return JSON.parse(m[1])['@type'] ?? '?'; } catch { return 'ParseError'; } });

    if (!title) issues.push('Missing title');
    else if (title.length > 70) issues.push(`Title too long (${title.length})`);
    if (!desc) issues.push('Missing description');
    if (!canon) issues.push('Missing canonical');
    if (!ogT) issues.push('Missing og:title');
    if (!ogI) issues.push('Missing og:image');
    if (!hre) issues.push('Missing hreflang');

    const status = issues.length === 0 ? '✅' : '⚠️';
    console.log(`${status} ${path}`);
    if (title) console.log(`   Title (${title.length}): ${title.slice(0, 70)}`);
    if (jsonld.length > 0) console.log(`   JSON-LD: ${jsonld.join(', ')}`);
    issues.forEach(i => console.log(`   ❌ ${i}`));
    console.log('');
    return issues.length;
  } catch (err) {
    console.log(`❌ ${path} — Fetch error: ${err}`);
    return 1;
  }
}

async function main() {
  console.log('🔍 KalenderIslam.id — SEO Audit\n');
  let total = 0;
  for (const p of PAGES) total += await auditPage(p);
  console.log(`\n📊 Result: ${total === 0 ? '✅ All OK' : `${total} issues found`}`);
}

main();
