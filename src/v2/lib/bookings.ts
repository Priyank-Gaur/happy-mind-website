import { type Psychologist } from "@/v2/data/psychologists";
import { type UserProfile } from "@/v2/hooks/use-user-profile";

export type PreferredSlot = {
  date: Date;
  dateFormatted: string; // e.g. "yyyy-MM-dd" or "EEE, d MMM yyyy"
  slot: string; // e.g. "10:00 AM - 11:00 AM"
};

export type BookingPayload = {
  serviceKey: "solv" | "happitalk" | string;
  serviceName: string;
  plan?: {
    id?: string;
    name?: string;
    price?: number;
    billing?: string;
  } | null;
  slot1: PreferredSlot;
  slot2: PreferredSlot;
  psychologist?: Psychologist | null;
  user: UserProfile;
};

const PENDING_STORAGE_KEY = "happimynd_pending_booking_v1";

export type PendingBookingState = {
  serviceKey: string;
  serviceName: string;
  slot1: PreferredSlot;
  slot2: PreferredSlot;
  plan?: {
    id?: string;
    name?: string;
    price?: number;
    billing?: string;
  } | null;
};

export function savePendingBooking(state: PendingBookingState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("Failed to save pending booking to sessionStorage", err);
  }
}

export function getPendingBooking(): PendingBookingState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_STORAGE_KEY) || localStorage.getItem(PENDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.slot1?.date) parsed.slot1.date = new Date(parsed.slot1.date);
    if (parsed?.slot2?.date) parsed.slot2.date = new Date(parsed.slot2.date);
    return parsed as PendingBookingState;
  } catch {
    return null;
  }
}

export function clearPendingBooking() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PENDING_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export type Booking = {
  id: string;
  service: string; // "HappiTALK" | "SOLV"
  serviceKey: string;
  name: string;
  email: string;
  phone: string;
  date: string; // ISO yyyy-mm-dd — preference 1
  slot: string; // e.g. "10:00 AM - 11:00 AM" — preference 1
  date2?: string; // ISO yyyy-mm-dd — preference 2 (optional)
  slot2?: string; // preference 2 (optional)
  notes?: string;
  createdAt: string; // ISO timestamp
};

const KEY = "happimynd_bookings_v1";
const EVT = "happimynd:bookings-change";

function read(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: Booking[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVT));
}

export const bookings = {
  get: read,
  add(booking: Omit<Booking, "id" | "createdAt">): Booking {
    const full: Booking = {
      ...booking,
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    const items = read();
    items.push(full);
    write(items);
    return full;
  },
};

/**
 * Bookable one-hour slots, every 30 minutes across the day.
 * e.g. "12:00 AM - 1:00 AM", "12:30 AM - 1:30 AM", … "11:30 PM - 12:30 AM".
 */
export const TIME_SLOTS: string[] = (() => {
  const fmt = (totalMinutes: number) => {
    const m = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
    let hour = Math.floor(m / 60);
    const minute = m % 60;
    const period = hour < 12 ? "AM" : "PM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
  };
  const slots: string[] = [];
  for (let start = 0; start < 24 * 60; start += 30) {
    slots.push(`${fmt(start)} - ${fmt(start + 60)}`);
  }
  return slots;
})();
