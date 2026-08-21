/**
 * HappiMynd Website JSON API client.
 *
 * Endpoints — from React_API_Reference_Shareable.md (tech lead):
 *
 * Public GET:
 *   GET  /api/v1/packages                          — packages & plans (optional auth)
 *   GET  /api/v1/website/psychologists             — psychologist listing + filters
 *   GET  /api/v1/website/other-services            — other/educational services
 *   GET  /api/v1/website/other-services/{id}       — single other service
 *   GET  /api/v1/organizer-list                    — organizations for sponsor signup
 *   GET  /api/v1/user-profile                      — profile types for signup
 *
 * Auth GET:
 *   GET  /api/v1/website/dashboard                 — user dashboard
 *   GET  /api/v1/website/subscribed-services       — user's active subscriptions
 *
 * Public POST:
 *   POST /api/v1/submit-contact                    — contact form
 *   POST /api/v1/website/other-services-signup     — educational service → Razorpay order_id JSON
 *   POST /api/v1/payment                           — bundle/package → hosted Razorpay link
 *   POST /api/v1/payment-for-happitalk             — psychologist booking → hosted link
 *   POST /api/v1/payment-for-happiguide            — SOLV/HappiGuide → hosted link
 *
 * Auth POST:
 *   POST /api/v1/website/raise-query               — raise a support query
 */

const BASE_URL = (
  (import.meta.env.VITE_AUTH_API_URL as string | undefined) ?? "https://happimynd.com"
).replace(/\/+$/, "");

const isDev = import.meta.env.DEV;

import { fetchWithCsrf } from "@/v2/lib/csrf";

function devLog(label: string, path: string, data: unknown) {
  if (isDev) {
    console.log(`🌐 [Website API] ${label}`, path, data);
  }
}

async function apiGet<T>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetchWithCsrf(BASE_URL, path, { headers });
  const json = await res.json();
  devLog("GET", path, json);
  if (!res.ok) throw new Error((json as any)?.message ?? `HTTP ${res.status}`);
  return json as T;
}

async function apiPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetchWithCsrf(BASE_URL, path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const json = await res.json();
  devLog("POST", path, json);
  if (!res.ok) throw new Error((json as any)?.message ?? `HTTP ${res.status}`);
  return json as T;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ApiEnvelope<T> = { status: string; message?: string; data: T };

// Packages
export type PackagePlan = {
  id: number;
  package_id: number;
  price: number;
  selling_price: number;
  per_session_selling_price?: number;
  offer?: { price: number; discount: string };
  offer_max_discount?: number;
  duration?: { id: number; name: string; type: number; value: unknown; frequency: unknown };
  expert_level?: unknown;
  is_subscribed: boolean;
  [key: string]: unknown;
};

export type Package = {
  id: number;
  name: string;
  description?: string;
  bundle: number;
  is_subscribed: boolean;
  plans: PackagePlan[];
  [key: string]: unknown;
};

// Psychologists
export type PsychologistFilterParams = {
  search?: string;
  city?: string;
  expert_category?: string;
  specialization?: string;
  language?: string;
  limit?: number;
};

export type ApiPsychologistPlan = {
  id: number;
  package_id?: number;
  duration_type_id?: number;
  price?: number;
  cost_price?: number;
  session_selling_price?: number;
  print_duration?: string;
  psychologist_custom_price?: {
    selling_price?: number;
    cost_price?: number;
    discount?: number;
  };
  [key: string]: unknown;
};

export type ApiPsychologist = {
  id: number;
  full_name: string;
  city?: { id: number; name: string } | string | null;
  languages?: Array<{ id: number; name: string } | string> | string | null;
  expert_level?: { id: number; name: string } | string | null;
  specialization?: Array<{ id: number; name: string } | string> | string | null;
  plans?: Record<string, ApiPsychologistPlan> | ApiPsychologistPlan[] | null;
  profile_picture_url?: string | null;
  minimum_session_price?: number | null;
  slot1?: number | null;
  slot2?: number | null;
  summary?: string | null;
  [key: string]: unknown;
};

export type PsychologistFilters = {
  specializations?: Array<{ id: number; name: string } | string>;
  expert_levels?: Array<{ id: number; name: string } | string>;
  languages?: Array<{ id: number; name: string } | string>;
  cities?: Array<{ id: number; name: string } | string>;
};

// Dashboard
export type ApiDashboard = {
  user?: Record<string, unknown>;
  assessment_id?: number;
  assessment_complete_status?: boolean | number;
  appointment_status?: boolean | string;
  plan_id?: number;
  slot_booked?: unknown[];
  booked_dates?: string[];
  disable_dates?: string[];
  show_blinking_text?: boolean;
  blinking_text?: "screening" | "summary_reading" | "happiapp" | string;
  dashboard_cover_pic?: string;
  hyperlink?: string;
  [key: string]: unknown;
};

// Subscribed Services
export type SubscribedPlan = {
  id: number;
  package_id: number;
  price: number;
  selling_price: number;
  per_session_selling_price?: number;
  offer?: { price: number; discount: string };
  duration?: { id: number; name: string; type: number; value: number; frequency: number };
  is_subscribed: boolean;
  [key: string]: unknown;
};

export type SubscribedPackage = {
  id: number;
  name: string;
  description?: string;
  bundle: number;
  is_subscribed: boolean;
  plans: SubscribedPlan[];
};

export type SubscribedServicesResponse = {
  packages: SubscribedPackage[];
  assessment?: {
    id: number;
    user_id: number;
    started_at?: string;
    ended_at?: string;
    score?: number;
    [key: string]: unknown;
  } | null;
  user_id?: number;
  subscribed_plan_ids?: number[];
  organization_plan_ids?: number[];
};

// Other Services
export type OtherService = {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  price?: number;
  image_url?: string;
  [key: string]: unknown;
};

export type OtherServicesSignupPayload = {
  other_service: number;
  name: string;
  email: string;
  mobile: string;
};

export type OtherServicesSignupResponse = {
  subscriber?: unknown;
  amount?: number;
  currency?: string;
  order_id?: string;
  razorpay_key?: string;
  callback_url?: string;
  [key: string]: unknown;
};

// Payment (hosted Razorpay link — all three payment endpoints return this)
export type PaymentLinkResponse = {
  status: string;
  message?: string;
  link: string;
};

export type PayForBundlePayload = {
  plan_id: number;
  amount: number;
  coupen_id?: number;
};

export type PayForHappiTalkPayload = {
  psychologist_id: number;
  plan_id: number;
  amount: number;
  date: string;
  time: string;
  session: number;
  user_recording_permission?: 0 | 1;
  coupen_id?: number;
};

export type PayForHappiGuidePayload = {
  plan_id: number;
  amount: number;
  date: string;
  time: string;
  coupen_id?: number;
};

// Support / Queries
export type RaiseQueryPayload = {
  category: "screening" | "payment" | "service" | "others";
  query: string;
};

// Coupon
export type ApplyCouponPayload = {
  plan_id: number;
  coupon: string;
};

export type ApplyCouponResponse = {
  status: string;
  message: string;
  data?: {
    coupon_id: number;
    plan_id: number;
    discount: number;
  };
};

export type AvailFreeServicePayload = {
  plan_id: number;
  coupen_id?: number;
};

export type AvailFreeServiceResponse = {
  status: string;
  message: string;
};

export type ContactPayload = {
  first_name: string;
  last_name: string;
  phone_number: string;
  reason: string;
  message?: string;
  referral?: string;
};

// Sponsor Signup
export type OrganizerItem = { id: number; name: string; [key: string]: unknown };
export type UserProfileItem = { id: number; name: string; status?: number; [key: string]: unknown };

// ─── API Methods ─────────────────────────────────────────────────────────────

/** GET /api/v1/packages — Fetch buyable packages & plans. Pass JWT for is_subscribed flags. */
export async function fetchPackages(token?: string): Promise<Package[]> {
  const raw = await apiGet<unknown>("/api/v1/packages", token);
  const data = (raw as any)?.data ?? (raw as any)?.packages ?? raw;
  return Array.isArray(data) ? data : [];
}

/** GET /api/v1/website/psychologists — Fetch psychologist listing with optional filters. */
export async function fetchPsychologists(
  params?: PsychologistFilterParams,
): Promise<{ psychologists: ApiPsychologist[]; filters: PsychologistFilters }> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.city && params.city !== "All") query.set("city", params.city);
  if (params?.expert_category && params.expert_category !== "All") query.set("expert_category", params.expert_category);
  if (params?.specialization && params.specialization !== "All") query.set("specialization", params.specialization);
  if (params?.language && params.language !== "All") query.set("language", params.language);
  if (params?.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  const path = `/api/v1/website/psychologists${qs ? `?${qs}` : ""}`;
  const raw = await apiGet<unknown>(path);

  const envelope = raw as any;
  const psychologists: ApiPsychologist[] =
    Array.isArray(envelope?.data) ? envelope.data :
    Array.isArray(envelope) ? envelope :
    Array.isArray(envelope?.psychologists) ? envelope.psychologists :
    [];

  const filters: PsychologistFilters = envelope?.filters ?? {};
  return { psychologists, filters };
}

/** GET /api/v1/website/dashboard 🔒 — User dashboard info. Requires Bearer token. */
export async function fetchUserDashboard(token: string): Promise<ApiDashboard> {
  const raw = await apiGet<unknown>("/api/v1/website/dashboard", token);
  return ((raw as any)?.data ?? raw) as ApiDashboard;
}

/**
 * GET /api/v1/website/subscribed-services 🔒
 * Returns only the plans the user is subscribed to + latest assessment + org plan IDs.
 */
export async function fetchSubscribedServices(token: string): Promise<SubscribedServicesResponse> {
  const raw = await apiGet<unknown>("/api/v1/website/subscribed-services", token);
  return ((raw as any)?.data ?? raw) as SubscribedServicesResponse;
}

/**
 * GET /api/v1/website/other-services
 * Response: { data: { happimynd: { service: [...] }, other_services: { service: [...] } } }
 */
export async function fetchOtherServices(): Promise<OtherService[]> {
  const raw = await apiGet<unknown>("/api/v1/website/other-services");
  const d = (raw as any)?.data ?? {};
  const services: OtherService[] = [
    ...((d?.happimynd?.service ?? []) as OtherService[]),
    ...((d?.other_services?.service ?? []) as OtherService[]),
  ];
  if (services.length === 0 && Array.isArray(d)) return d as OtherService[];
  return services;
}

/** GET /api/v1/website/other-services/{id} — Single other/educational service. */
export async function fetchOtherService(id: number): Promise<OtherService | null> {
  try {
    const raw = await apiGet<unknown>(`/api/v1/website/other-services/${id}`);
    return ((raw as any)?.data ?? raw) as OtherService;
  } catch {
    return null;
  }
}

/**
 * POST /api/v1/website/other-services-signup
 * ONLY for OtherService records (educational/workshops). NOT for packages or psychologist bookings.
 * Returns Razorpay order_id + razorpay_key + callback_url (JSON, not a hosted link).
 */
export async function createOtherServicesSignup(
  payload: OtherServicesSignupPayload,
): Promise<OtherServicesSignupResponse> {
  const raw = await apiPost<unknown>("/api/v1/website/other-services-signup", payload);
  return ((raw as any)?.data ?? raw) as OtherServicesSignupResponse;
}

/**
 * POST /api/v1/payment
 * Purchase a bundle/package plan.
 * Returns { link } — open in new tab: window.open(response.link, "_blank")
 */
export async function payForBundle(
  payload: PayForBundlePayload,
  token?: string,
): Promise<PaymentLinkResponse> {
  const raw = await apiPost<unknown>("/api/v1/payment", {
    plan_id: payload.plan_id,
    amount: payload.amount,
    coupen_id: payload.coupen_id ?? 0,
  }, token);
  return raw as PaymentLinkResponse;
}

/**
 * POST /api/v1/payment-for-happitalk
 * Book a psychologist (HappiTALK) session.
 * Validates slot availability — throws if slot taken.
 * Returns { link } — open in new tab: window.open(response.link, "_blank")
 */
export async function payForHappiTalk(
  payload: PayForHappiTalkPayload,
  token?: string,
): Promise<PaymentLinkResponse> {
  const raw = await apiPost<unknown>("/api/v1/payment-for-happitalk", {
    psychologist_id: payload.psychologist_id,
    plan_id: payload.plan_id,
    amount: payload.amount,
    date: payload.date,
    time: payload.time,
    session: payload.session,
    user_recording_permission: payload.user_recording_permission ?? 1,
    coupen_id: payload.coupen_id ?? 0,
  }, token);
  return raw as PaymentLinkResponse;
}

/**
 * POST /api/v1/payment-for-happiguide
 * Book a SOLV / HappiGuide session.
 * Note: requires a psychologist assigned to the HappiGuide plan in admin.
 * Returns { link } — open in new tab: window.open(response.link, "_blank")
 */
export async function payForHappiGuide(
  payload: PayForHappiGuidePayload,
  token?: string,
): Promise<PaymentLinkResponse> {
  const raw = await apiPost<unknown>("/api/v1/payment-for-happiguide", {
    plan_id: payload.plan_id,
    amount: payload.amount,
    date: payload.date,
    time: payload.time,
    coupen_id: payload.coupen_id ?? 0,
  }, token);
  return raw as PaymentLinkResponse;
}

/**
 * POST /api/v1/website/raise-query 🔒
 * Raise a support query. Auth required.
 * category: "screening" | "payment" | "service" | "others"
 */
export async function raiseQuery(
  payload: RaiseQueryPayload,
  token: string,
): Promise<{ status: string; message?: string }> {
  const cleanPayload = {
    category: payload.category,
    query: payload.query,
  };
  const raw = await apiPost<unknown>("/api/v1/website/raise-query", cleanPayload, token);
  return raw as { status: string; message?: string };
}

/**
 * POST /api/v1/submit-contact (public)
 * Submit the contact / support form.
 */
export async function submitContact(
  payload: ContactPayload,
): Promise<{ message?: string; status?: string }> {
  const raw = await apiPost<unknown>("/api/v1/submit-contact", payload);
  return raw as { message?: string; status?: string };
}

/** GET /api/v1/organizer-list — Organizations for sponsor signup company dropdown. */
export async function fetchOrganizerList(): Promise<OrganizerItem[]> {
  const raw = await apiGet<unknown>("/api/v1/organizer-list");
  const data = (raw as any)?.data ?? raw;
  return Array.isArray(data) ? data : [];
}

/** GET /api/v1/user-profile — Profile types for sponsor/individual signup dropdown. */
export async function fetchUserProfileList(): Promise<UserProfileItem[]> {
  const raw = await apiGet<unknown>("/api/v1/user-profile");
  const data = (raw as any)?.data ?? raw;
  return Array.isArray(data) ? data : [];
}

/**
 * POST /api/v1/apply-coupon 🔒
 * Validate a coupon code for a given plan. Returns discount percentage.
 */
export async function applyCoupon(
  payload: ApplyCouponPayload,
  token: string,
): Promise<ApplyCouponResponse> {
  const raw = await apiPost<unknown>("/api/v1/apply-coupon", {
    plan_id: payload.plan_id,
    coupon: payload.coupon,
  }, token);
  return raw as ApplyCouponResponse;
}

/**
 * POST /api/v1/avail-free-services 🔒
 * Activate a subscription directly without Razorpay (for 100% discount coupons).
 * Creates BundleStatus + CouponReceipt on the backend.
 */
export async function availFreeService(
  payload: AvailFreeServicePayload,
  token: string,
): Promise<AvailFreeServiceResponse> {
  const raw = await apiPost<unknown>("/api/v1/avail-free-services", {
    plan_id: payload.plan_id,
    coupen_id: payload.coupen_id ?? 0,
  }, token);
  return raw as AvailFreeServiceResponse;
}
