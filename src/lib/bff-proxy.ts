// Only these reach the backend. Cookies and the rest of the browser's headers
// stay here: the backend authenticates by bearer token alone.
const FORWARDED_HEADERS = ["authorization", "content-type", "accept"];

/**
 * Relays one request to the Go API and hands back its status and body untouched.
 *
 * The status must survive the hop: the axios client refreshes the session on a
 * 401, so a proxy that folds a 400 or a 409 slot conflict into 401 turns every
 * validation error into a token refresh plus a replayed request.
 */
export const proxyToApi = async (
  request: Request,
  path: string
): Promise<Response> => {
  const apiRoot = process.env.API_ROOT;
  if (!apiRoot) {
    return Response.json(
      { message: "API_ROOT chưa được cấu hình trên máy chủ frontend." },
      { status: 500 }
    );
  }

  const headers = new Headers();
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  // The backend rate-limits guests by IP. Without the original client address
  // every guest arrives from this server's IP and they all share one bucket.
  // Behind the CDN the leftmost X-Forwarded-For entry is whatever the browser
  // chose to send, while CF-Connecting-IP is set by the edge itself.
  const clientIp =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip");
  if (clientIp) headers.set("x-forwarded-for", clientIp);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const { search } = new URL(request.url);

  try {
    const upstream = await fetch(`${apiRoot}/${path}${search}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });

    const responseHeaders = new Headers({
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    });
    const retryAfter = upstream.headers.get("retry-after");
    if (retryAfter) responseHeaders.set("retry-after", retryAfter);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { message: "Không kết nối được máy chủ, vui lòng thử lại sau ít phút." },
      { status: 502 }
    );
  }
};
