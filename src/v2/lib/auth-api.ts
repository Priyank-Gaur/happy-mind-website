/**
 * HappiMynd Authentication & OTP API client.
 *
 * Base URL: https://happimynd.com
 * All auth endpoints are under /api/v1/
 *
 * Per the integration doc:
 *   POST /api/v1/send-login-otp   — send OTP
 *   POST /api/v1/verify-login-otp — verify OTP → login OR register
 *   POST /api/v1/signup           — complete registration
 *   POST /api/v1/login            — username + password login
 *   POST /api/v1/forgot-password  — initiate password reset
 *   POST /api/v1/verify-otp       — verify reset OTP
 *   POST /api/v1/reset-password   — set new password
 *   POST /api/v1/edit-profile     — update profile (mobile-API mirror of the
 *                                   legacy /edit-profile web route, Bearer auth)
 *
 * NOTE: /api/v1/login and /api/v1/edit-profile field names are not yet
 * confirmed against the live backend — they mirror the shapes used
 * elsewhere in this file (signup payload / get-profile response) and
 * should be adjusted once the tech lead confirms the real shapes.
 *
 * Can be overridden via VITE_AUTH_API_URL env variable for staging.
 */

const BASE_URL = (
  (import.meta.env.VITE_AUTH_API_URL as string | undefined) ?? "https://happimynd.com"
).replace(/\/+$/, "");

import { fetchWithCsrf } from "@/v2/lib/csrf";

const E = {
  sendLoginOtp: "/api/v1/send-login-otp",
  verifyLoginOtp: "/api/v1/verify-login-otp",
  forgotPassword: "/api/v1/forgot-password",
  verifyOtp: "/api/v1/verify-otp",
  resetPassword: "/api/v1/reset-password",
  getProfile: "/api/v1/get-profile",
  signUp: "/api/v1/signup",
  login: "/api/v1/login",
  editProfile: "/api/v1/edit-profile",
} as const;

// ---------------------------------------------------------------------------
// Profile Types — IDs 1–10 matching the backend DB (per integration doc)
// ---------------------------------------------------------------------------
export const PROFILE_TYPES = [
  { id: 1,  label: "Salaried" },
  { id: 2,  label: "Self Employed" },
  { id: 3,  label: "Home Maker" },
  { id: 4,  label: "Senior Citizen" },
  { id: 5,  label: "Student (School)" },
  { id: 6,  label: "Student (College/University)" },
  { id: 7,  label: "Entrepreneur" },
  { id: 8,  label: "Jobseeker" },
  { id: 9,  label: "Frontline Warrior" },
  { id: 10, label: "Working Woman" },
] as const;

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------
export type ApiStatus = "success" | "error" | "register";

export type ApiResponse = {
  status: "success" | "error";
  message?: string;
};

/**
 * Payload: POST /api/v1/send-login-otp
 * Fields confirmed by integration doc.
 */
export type SendLoginOtpPayload = {
  type: "mobile";         // always "mobile" for web OTP login
  mobile: string;         // 10-digit without country code
  country_code: string;   // e.g. "91"
};

/**
 * Payload: POST /api/v1/verify-login-otp
 */
export type VerifyLoginOtpPayload = {
  mobile: string;
  country_code: string;
  otp: string;            // 6-digit OTP
};

/**
 * Three outcomes per the integration doc:
 *  "success"  → existing user, access_token granted
 *  "register" → new number, mobile_verified_token for registration
 *  "error"    → wrong OTP or server error
 */
export type VerifyLoginOtpResponse =
  | { status: "success";  access_token: string;          message?: string }
  | { status: "register"; mobile_verified_token: string; message?: string }
  | { status: "error";    message?: string };

/**
 * Payload: POST /api/v1/signup
 * Required fields per the integration doc.
 */
export type SignUpPayload = {
  nickname: string;
  user_profile_id: number;   // 1–10, maps to PROFILE_TYPES
  age: number;
  gender: string;            // "male" | "female" | "other"
  username: string;
  password: string;
  confirm_password: string;
  signup_type: string;       // "individual" | "organization"
  country_code: string;      // "91"
  mobile: string;            // 10-digit
  language: number;          // 1 = English
  device_token: string;      // "" for web (no FCM)
  mobile_verified_token: string;
  happimyndCode?: string;    // optional sponsor code
};

export type SignUpResponse =
  | { status: "success" | "error" | boolean | number; access_token?: string; token?: string; message?: string; data?: { access_token?: string; token?: string } }
  | Record<string, any>;

/**
 * Payload: POST /api/v1/login
 * Mobile-API mirror of the legacy /login web route.
 */
export type LoginPayload = {
  username: string;
  password: string;
};

export type LoginResponse =
  | { access_token: string; token_type?: string; user?: Record<string, any>; status?: "success"; message?: string }
  | { status: "error"; message?: string };

/**
 * Payload: POST /api/v1/edit-profile (Bearer auth)
 * Mobile-API mirror of the legacy /edit-profile web route — field names
 * match the ones already used by signup/get-profile in this file.
 */
export type EditProfilePayload = {
  nickname: string;
  username: string;
  email?: string;
  mobile?: string;   // omitted when unchanged — backend raises uniqueness error on re-submit
  age: number;
  gender: string;
  avatar?: string;
  user_profile_id?: number;
  [key: string]: any;
};

export type EditProfileResponse = ApiResponse & Record<string, any>;

/**
 * Payload: POST /api/v1/forgot-password
 */
export type ForgotPasswordPayload = {
  type: "mobile" | "email";
  mobile: string;
  email: string;
};

/**
 * Payload: POST /api/v1/verify-otp
 */
export type VerifyOtpPayload = {
  mobile: string;
  email: string;
  otp: string;
};

/**
 * Payload: POST /api/v1/reset-password
 */
export type ResetPasswordPayload = {
  mobile: string;
  email: string;
  password: string;
  confirm_password: string;
};

// ---------------------------------------------------------------------------
// Internal fetch helper
// ---------------------------------------------------------------------------
async function postJson<T>(path: string, payload: unknown): Promise<T> {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetchWithCsrf(BASE_URL, path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        status: "error",
        message:
          (json as any)?.message ??
          (res.status === 419
            ? "CSRF token mismatch — please refresh the page and try again."
            : `Server returned ${res.status}`),
      } as unknown as T;
    }

    return json as T;
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Network error",
    } as unknown as T;
  }
}

// ---------------------------------------------------------------------------
// Exported API methods
// ---------------------------------------------------------------------------

/** POST /api/v1/send-login-otp */
export function sendLoginOtp(payload: SendLoginOtpPayload): Promise<ApiResponse> {
  return postJson<ApiResponse>(E.sendLoginOtp, payload);
}

/** POST /api/v1/verify-login-otp */
export function verifyLoginOtp(
  payload: VerifyLoginOtpPayload,
): Promise<VerifyLoginOtpResponse> {
  return postJson<VerifyLoginOtpResponse>(E.verifyLoginOtp, payload);
}

/** POST /api/v1/signup */
export function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  return postJson<SignUpResponse>(E.signUp, payload);
}

/** POST /api/v1/login */
export function login(payload: LoginPayload): Promise<LoginResponse> {
  return postJson<LoginResponse>(E.login, payload);
}

/** POST /api/v1/forgot-password */
export function forgotPassword(payload: ForgotPasswordPayload): Promise<ApiResponse> {
  return postJson<ApiResponse>(E.forgotPassword, payload);
}

/** POST /api/v1/verify-otp */
export function verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse> {
  return postJson<ApiResponse>(E.verifyOtp, payload);
}

/** POST /api/v1/reset-password */
export function resetPassword(payload: ResetPasswordPayload): Promise<ApiResponse> {
  return postJson<ApiResponse>(E.resetPassword, payload);
}

/** GET /api/v1/get-profile (Bearer token) */
export async function fetchProfile(
  token: string,
): Promise<ApiResponse & Record<string, any>> {
  try {
    const res = await fetchWithCsrf(BASE_URL, E.getProfile, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const json = (await res.json()) as ApiResponse & Record<string, any>;
    return json;
  } catch {
    return { status: "error", message: "Failed to fetch profile" };
  }
}

/** Alias kept for login.tsx backwards-compat */
export const getProfile = fetchProfile;

/** POST /api/v1/edit-profile (Bearer token) */
export async function editProfile(
  token: string,
  payload: EditProfilePayload,
): Promise<EditProfileResponse> {
  try {
    const res = await fetchWithCsrf(BASE_URL, E.editProfile, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => null)) as EditProfileResponse | null;
    if (!res.ok) {
      return {
        status: "error",
        message: json?.message ?? `Server returned ${res.status}`,
      };
    }
    return json ?? { status: "error", message: "Empty response" };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Network error",
    };
  }
}
