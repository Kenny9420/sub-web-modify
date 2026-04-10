export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const target = url.searchParams.get('target') || 'clash';
  const sourceUrl = url.searchParams.get('url');
  
  if (!sourceUrl) {
    return new Response(
      JSON.stringify({"error": "url parameter required"}),
      { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }

  const upstream = 'https://sub.v1.mk/sub?target=' + target + '&url=' + encodeURIComponent(sourceUrl);
  
  const upstreamResponse = await fetch(upstream, {
    headers: {
      'User-Agent': request.headers.get('user-agent') || 'ClashForAndroid/2.5.12',
      'Accept': request.headers.get('accept') || '*/*',
    }
  });
  
  const contentType = upstreamResponse.headers.get('content-type') || 'text/plain';
  const upstreamBody = await upstreamResponse.arrayBuffer();
  
  return new Response(upstreamBody, {
    status: upstreamResponse.status,
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
    }
  });
}
