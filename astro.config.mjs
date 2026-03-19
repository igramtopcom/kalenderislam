// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  site: 'https://kalenderislam.id',
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !page.includes('/pdf') && !page.includes('/api/'),
      serialize(item) {
        const url = item.url;
        if (url === 'https://kalenderislam.id/') return { ...item, priority: 1.0, changefreq: 'daily' };
        if (url.includes('/hari-besar/') && url.includes('/2026')) return { ...item, priority: 0.9, changefreq: 'monthly' };
        const kotaBesar = ['jakarta','surabaya','bandung','medan','semarang'];
        if (url.includes('/sholat/') && kotaBesar.some(k => url.includes(`/sholat/${k}`))) return { ...item, priority: 0.9, changefreq: 'daily' };
        if ((url.includes('/kalender/2026') || url.includes('/ramadan/2026'))) return { ...item, priority: 0.8, changefreq: 'monthly' };
        if (url.includes('/konversi') || url.includes('/weton')) return { ...item, priority: 0.8, changefreq: 'weekly' };
        if (url.includes('/libur-nasional/') || url.includes('/kalender-jawa/')) return { ...item, priority: 0.7, changefreq: 'yearly' };
        return { ...item, priority: 0.5, changefreq: 'yearly' };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    cacheDir: '/tmp/vite-kalenderislam',
  },
  prefetch: true,
});
