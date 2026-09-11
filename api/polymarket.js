// Proxy simples para o mercado do Polymarket (evita problemas de CORS e faz cache na Vercel)
export const config = { runtime: 'edge' };

const SLUG = 'variational-fdv-above-one-day-after-launch';

export default async function handler() {
  try {
    const r = await fetch(`https://gamma-api.polymarket.com/events?slug=${SLUG}`, {
      headers: { accept: 'application/json' },
    });
    const body = await r.text();
    return new Response(body, {
      status: r.status,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 's-maxage=120, stale-while-revalidate=600',
        'access-control-allow-origin': '*',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'upstream_failed' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
}
