// Cloudflare Pages _worker.js - subscription proxy
// This worker handles ALL routes. /sub is proxied to sub.v1.mk, other routes return 404 (let static files handle it).
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only handle /sub route
    if (!url.pathname.startsWith('/sub')) {
      return new Response('Not Found', { status: 404 });
    }

    const target = url.searchParams.get('target') || 'clash';
    const sourceUrl = url.searchParams.get('url');

    if (!sourceUrl) {
      return new Response(
        JSON.stringify({ error: 'url parameter required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const upstream = 'https://sub.v1.mk/sub?target=' + target + '&url=' + encodeURIComponent(sourceUrl);

    try {
      const resp = await fetch(upstream, {
        headers: {
          'User-Agent': request.headers.get('user-agent') || 'ClashForAndroid/2.5.12',
          'Accept': request.headers.get('accept') || '*/*',
        }
      });
      const ct = resp.headers.get('content-type') || 'text/plain';
      const body = await resp.arrayBuffer();
      return new Response(body, {
        status: resp.status,
        headers: {
          'Content-Type': ct,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        }
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: 'backend unavailable' }),
        { status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }
  }
};
