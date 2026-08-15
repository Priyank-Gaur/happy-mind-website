export type ContactQuery = {
  id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  queryFor: string;
  message?: string;
  slot: string;
  createdAt: string; // ISO timestamp
};

const KEY = "happimynd_contact_queries_v1";
const EVT = "happimynd:contact-queries-change";

function read(): ContactQuery[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(items: ContactQuery[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVT));
}

export const contactQueries = {
  get: read,
  add(query: Omit<ContactQuery, "id" | "createdAt">): ContactQuery {
    const full: ContactQuery = {
      ...query,
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `cq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    const items = read();
    items.push(full);
    write(items);
    return full;
  },
};

/** "Query For*" options. */
export const QUERY_REASONS = [
  "Personal Support",
  "Corporate Query",
  "SOLV Session Request",
  "Counselling Support",
  "Self Help Support",
  "Other",
];

/** "Select Preferred Reachout Slot*" options. */
export const REACHOUT_SLOTS = [
  "Morning (9 am - 12 pm)",
  "Afternoon (12 pm - 4 pm)",
  "Evening (4 pm - 8 pm)",
];
