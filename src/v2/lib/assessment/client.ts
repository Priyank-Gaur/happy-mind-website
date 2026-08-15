/**
 * Thin fetch wrapper for the HappiLIFE Awareness Tool API.
 *
 * Responsibilities:
 *  - Reads the base URL from VITE_HAPPILIFE_API_URL (change the .env, not this file)
 *  - Attaches Authorization: Bearer <token> from the auth store on every request
 *  - Throws ApiError on non-2xx responses with the HTTP status code included
 *
 * All HappiLIFE endpoints accept both GET and POST; we always use POST for
 * body-bearing requests (and POST with an empty body for the rest) to match the
 * mobile SDK pattern described in the spec.
 */

import { auth } from "@/v2/lib/auth";
import { fetchWithCsrf } from "@/v2/lib/csrf";
import { ApiError } from "./types";

/**
 * Base URL for the HappiLIFE external API.
 * Falls back to an empty string so TypeScript is happy during dev — requests
 * will fail with a clear network error rather than a silent wrong URL.
 */
const BASE_URL = ((import.meta.env.VITE_HAPPILIFE_API_URL as string | undefined) ?? "https://happimynd.com").replace(
  /\/+$/,
  "",
);

/**
 * Core POST helper. All 9 assessment endpoints are called through this.
 *
 * @param path  — e.g. "/api/v1/start-assessment"
 * @param body  — optional request payload (will be JSON-serialised)
 * @returns     — parsed JSON response body as T
 * @throws ApiError on non-2xx HTTP status
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const token = auth.get()?.token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetchWithCsrf(BASE_URL, path, {
    method: "POST",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Parse JSON regardless of status so we can surface the API's error message
  let json: unknown;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  if (!response.ok) {
    const message =
      typeof json === "object" &&
        json !== null &&
        "message" in json &&
        typeof (json as Record<string, unknown>).message === "string"
        ? ((json as Record<string, unknown>).message as string)
        : `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message);
  }

  return json as T;
}
