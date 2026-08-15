/**
 * Laravel CSRF handling for the API client.
 *
 * Laravel returns HTTP 419 ("CSRF token mismatch") on POST/PUT/DELETE requests
 * that hit a CSRF-protected route without a valid token. This helper:
 *   1. Tries the request as-is first (CSRF-exempt APIs keep working).
 *   2. On 419, acquires a CSRF token via the Sanctum cookie endpoint
 *      (/sanctum/csrf-cookie, falling back to /api/v1/csrf-cookie) and
 *      retries with `credentials: "include"` + the `X-XSRF-TOKEN` header.
 *
 * The retry only succeeds when the API is configured for credentialed CORS
 * (Access-Control-Allow-Origin: <explicit origin> + Access-Control-Allow-Credentials:
 * true). If it isn't, the original 419 response is returned so callers can
 * surface a clear message instead of a generic network error.
 */

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

let lastAcquireAt = 0;

export async function acquireCsrfToken(baseUrl: string): Promise<string | null> {
  const existing = readCookie("XSRF-TOKEN");
  if (existing) return existing;

  if (Date.now() - lastAcquireAt < 3000) return null;
  lastAcquireAt = Date.now();

  const endpoints = ["/sanctum/csrf-cookie", "/api/v1/csrf-cookie"];
  for (const ep of endpoints) {
    try {
      await fetch(`${baseUrl}${ep}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
    } catch {
      // Cross-origin credential requests can be blocked by CORS — ignore and
      // fall through so we still check for a cookie below.
    }
    const token = readCookie("XSRF-TOKEN");
    if (token) return token;
  }
  return readCookie("XSRF-TOKEN");
}

export async function fetchWithCsrf(
  baseUrl: string,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, init);
  if (res.status !== 419) return res;

  const token = await acquireCsrfToken(baseUrl);
  if (!token) return res;

  try {
    const headers = (init.headers ?? {}) as Record<string, string>;
    return await fetch(url, {
      ...init,
      credentials: "include",
      headers: {
        ...headers,
        "X-XSRF-TOKEN": token,
      },
    });
  } catch {
    return res;
  }
}
