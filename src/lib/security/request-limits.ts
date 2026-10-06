const MAX_REQUEST_BYTES = 1_100_000;

export async function limitRequestBody(request: Request): Promise<Request | Response> {
  if (request.method === "GET" || request.method === "HEAD" || !request.body) return request;
  const reject = () =>
    new Response("Carga de dados muito grande.", {
      status: 413,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  if (Number(request.headers.get("content-length")) > MAX_REQUEST_BYTES) return reject();
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      void reader.cancel();
      return reject();
    }
    parts.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    bytes.set(part, offset);
    offset += part.byteLength;
  }
  // Vite can supply a request proxy, which Undici cannot clone as a native Request.
  const bounded = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: bytes,
  });
  if ("runtime" in request) Object.assign(bounded, { runtime: request.runtime });
  return bounded;
}
