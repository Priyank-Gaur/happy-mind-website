/* Session handling for the HappiMynd platform.
 *
 * This site does not own an auth system — it piggybacks on the same Laravel
 * Sanctum cookie session the platform already issues (the same one the contact
 * form's CSRF handshake relies on). Everything here is read-only: we ask the
 * backend who the visitor is, and hand them to the platform's login page when
 * the answer is "nobody".
 *
 * Endpoints are configurable so this can be pointed at the real routes without
 * touching component code — see .env.example.
 */

const API_BASE = import.meta.env.VITE_HAPPIMYND_API_BASE ?? "";
const USER_ENDPOINT =
  import.meta.env.VITE_HAPPIMYND_USER_ENDPOINT ?? "/api/user";
const LOGIN_URL =
  import.meta.env.VITE_HAPPIMYND_LOGIN_URL ?? "https://happimynd.com/login";
const LOGIN_REDIRECT_PARAM =
  import.meta.env.VITE_HAPPIMYND_LOGIN_REDIRECT_PARAM ?? "redirect";

/** Marks "this visitor was sent to login mid-booking" across the redirect. */
const RESUME_KEY = "happimynd:resume-booking";
/** Query flag the login page sends back with the return URL. */
const RESUME_PARAM = "book";

export interface HappiMyndUser {
  name: string;
  email: string;
  phone: string;
}

export type AuthState =
  /** Still asking the backend. */
  | { status: "checking" }
  /** Signed in; profile ready (fields may still be blank if absent upstream). */
  | { status: "authenticated"; user: HappiMyndUser }
  /** Backend answered 401/419 — a real "not signed in". */
  | { status: "unauthenticated" }
  /** Endpoint unreachable or not wired up yet. Never redirect on this. */
  | { status: "unavailable" };

/** Pulls a display name out of whichever shape the profile endpoint returns. */
const readName = (data: Record<string, unknown>): string => {
  const direct = data.name ?? data.full_name ?? data.fullName;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const first = data.first_name ?? data.firstName;
  const last = data.last_name ?? data.lastName;
  return [first, last]
    .filter((part): part is string => typeof part === "string" && !!part.trim())
    .join(" ")
    .trim();
};

const readString = (
  data: Record<string, unknown>,
  keys: string[],
): string => {
  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
};

const normalizeUser = (payload: unknown): HappiMyndUser | null => {
  if (!payload || typeof payload !== "object") return null;

  // Laravel resources commonly nest the record under `data` or `user`.
  const record = payload as Record<string, unknown>;
  const source = (record.data ?? record.user ?? record) as Record<
    string,
    unknown
  >;
  if (!source || typeof source !== "object") return null;

  const user = {
    name: readName(source),
    email: readString(source, ["email", "email_address", "emailAddress"]),
    phone: readString(source, [
      "phone",
      "phone_number",
      "phoneNumber",
      "mobile",
      "mobile_number",
      "contact_number",
    ]),
  };

  // A profile with no identifying field at all is not a usable session.
  return user.name || user.email || user.phone ? user : null;
};

/**
 * Asks the platform who the current visitor is, using the existing session
 * cookie. Never throws — callers get a state to render.
 */
export const fetchCurrentUser = async (
  signal?: AbortSignal,
): Promise<AuthState> => {
  try {
    const response = await fetch(`${API_BASE}${USER_ENDPOINT}`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      signal,
    });

    // Sanctum answers 401 for a missing session and 419 for an expired one.
    if (response.status === 401 || response.status === 419) {
      return { status: "unauthenticated" };
    }

    if (!response.ok) return { status: "unavailable" };

    // A login page served as HTML means the route isn't the JSON API we expect.
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return { status: "unavailable" };
    }

    const user = normalizeUser(await response.json());
    return user
      ? { status: "authenticated", user }
      : { status: "unauthenticated" };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { status: "checking" };
    }
    // Network failure, CORS rejection, endpoint absent — degrade, don't redirect.
    return { status: "unavailable" };
  }
};

/** The URL the login page should send the visitor back to. */
const bookingReturnUrl = (): string => {
  const url = new URL(window.location.href);
  url.searchParams.set(RESUME_PARAM, "1");
  return url.toString();
};

/**
 * Hands the visitor to the platform login page, remembering that they were
 * mid-booking so the form can reopen when they land back here.
 */
export const redirectToLogin = (): void => {
  try {
    sessionStorage.setItem(RESUME_KEY, "1");
  } catch {
    // Private browsing can refuse storage; the query param still covers us.
  }

  const target = new URL(LOGIN_URL);
  target.searchParams.set(LOGIN_REDIRECT_PARAM, bookingReturnUrl());
  window.location.href = target.toString();
};

/**
 * True when this page load is the return leg of a login redirect, so the
 * booking form should reopen on its own. Clears the marker as it reads it.
 */
export const consumeBookingResume = (): boolean => {
  let resume = false;

  try {
    if (sessionStorage.getItem(RESUME_KEY) === "1") {
      resume = true;
      sessionStorage.removeItem(RESUME_KEY);
    }
  } catch {
    // ignore unavailable storage
  }

  const url = new URL(window.location.href);
  if (url.searchParams.get(RESUME_PARAM) === "1") {
    resume = true;
    url.searchParams.delete(RESUME_PARAM);
    window.history.replaceState({}, "", url.toString());
  }

  return resume;
};
