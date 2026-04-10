export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const target = url.searchParams.get('target') || 'clash';
  const sourceUrl = url.searchParams.get('url');
  
  if (!sourceUrl) {
    return new Response(
      JSON.stringify({"error": "url parameter required"}),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const targetUrl = 'https://sub.v1.mk/sub?target=' + target + '&url=' + encodeURIComponent(sourceUrl);
  
  try {
    const resp = await fetch(targetUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'ClashForAndroid/2.5.12',
        'Accept': request.headers.get('accept') || '*/*',
      },
      cf: { cacheTtl: 60 }
    });
    
    const ct = resp.headers.get('content-type') || 'text/plain';
    const body = await resp.arrayBuffer();
    
    const respHeaders = {
      'Content-Type': ct,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };
    
    const cc = resp.headers.get('cache-control');
    if (cc) { respHeaders['Cache-Control'] = cc; }
    
    return new Response(body, { status: resp.status, headers: respHeaders });
  } catch (e) {
    return new Response(
      JSON.stringify({"error": "backend unavailable", "detail": String(e)}),
      { status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
}
