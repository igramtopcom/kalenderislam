import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  return new Response(JSON.stringify({ status: 'placeholder', slug: params.slug }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
