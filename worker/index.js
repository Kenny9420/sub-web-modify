// KV Short Link Worker - subscription converter
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

function generateId(len = 5) {
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(arr).map(b => CHARS[b % CHARS.length]).join('');
}

async function convert(subUrl, target, opts) {
  const params = new URLSearchParams();
  params.set('target', target || 'clash');
  params.set('url', subUrl);
  if (opts.fuzzy)  params.set('fuzzy', opts.fuzzy);
  if (opts.limit)   params.set('limit', opts.limit);
  if (opts.name)    params.set('name', opts.name);
  if (opts.emoji === false) params.set('emoji', 'false');
  if (opts.udp === false)    params.set('udp', 'false');
  if (opts.skipCert) params.set('scert', 'true');
  if (opts.sort)     params.set('sort', 'true');

  const upstreams = [
    'https://subconverters.netlify.app/api/convert?' + params.toString(),
    'https://sub.v1.mk/api/v1/client/subscribe?' + params.toString(),
  ];

  for (const upstream of upstreams) {
    try {
      const resp = await fetch(upstream, {
        headers: { 'User-Agent': 'ClashForAndroid/2.5.12', 'Accept': '*/*' }
      });
      if (!resp.ok) continue;
      const ct = resp.headers.get('content-type') || '';
      const body = await resp.arrayBuffer();
      if (ct.includes('text/html') && body.byteLength > 1000) continue;
      const info = resp.headers.get('subscription-userinfo') || '';
      return { body: new Uint8Array(body), ct: ct || 'text/plain; charset=utf-8', info };
    } catch (e) {}
  }
  return null;
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  // POST /s → create short link
  if (request.method === 'POST' && pathname === '/s') {
    let body;
    try { body = await request.json(); }
    catch (e) { body = Object.fromEntries(new URLSearchParams(await request.text())); }
    const { subUrl, target, fuzzy, limit, name, emoji, udp, skipCert, sort } = body;
    if (!subUrl) return json({ error: 'subUrl required' }, 400);

    let id;
    for (let i = 0; i < 10; i++) {
      id = generateId(5);
      if (!(await SHORT_LINKS.get(id))) break;
    }

    const config = JSON.stringify({
      u: subUrl, t: target || 'clash', f: fuzzy || '', l: limit || '',
      n: name || '', e: emoji !== 'false', d: udp !== 'false',
      s: !!skipCert, o: !!sort
    });

    await SHORT_LINKS.put(id, config);
    const shortUrl = url.origin + '/s/' + id;
    return json({ ok: true, id, shortUrl, yamlUrl: shortUrl,
      message: '复制 yamlUrl 填入 Clash 远程订阅' }, 201);
  }

  // GET /s → info
  if (request.method === 'GET' && pathname === '/s') {
    return json({ service: 'sub-short-link-kv', kv: 'ready' });
  }

  // GET /s/:id → convert and serve YAML
  const match = pathname.match(/^\/s\/([A-Za-z0-9_-]+)$/);
  if (request.method === 'GET' && match) {
    const id = match[1];
    const cfgStr = await SHORT_LINKS.get(id);
    if (!cfgStr) return json({ error: '短链不存在或已过期', id }, 404);
    const cfg = JSON.parse(cfgStr);
    const result = await convert(cfg.u, cfg.t, cfg);
    if (!result) return json({ error: '转换失败，请重试' }, 502);

    const filename = (cfg.n || 'subscription') + '.yaml';
    const headers = new Headers();
    headers.set('Content-Type', result.ct);
    headers.set('Content-Disposition', 'attachment; filename="' + filename + '"');
    headers.set('Subscription-Userinfo', result.info);
    headers.set('Cache-Control', 'no-store');
    headers.set('Access-Control-Allow-Origin', '*');
    return new Response(result.body, { status: 200, headers });
  }

  // DELETE /s/:id
  if (request.method === 'DELETE' && match) {
    await SHORT_LINKS.delete(match[1]);
    return json({ ok: true, id: match[1] });
  }

  return json({ error: 'Not found' }, 404);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
