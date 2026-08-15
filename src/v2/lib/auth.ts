import { useEffect, useState } from "react";

/**
 * Lightweight client-side auth for the HappiMynd demo.
 * State lives in localStorage so a signed-in session survives refreshes.
 * (No real backend — this simply gates the dashboard behind the login page.)
 */

const KEY = "happimynd_auth_v1";
const EVT = "happimynd:auth-change";

export type AuthUser = {
  name: string;
  email: string;
  /** Bearer token from the OTP / sign-up endpoints. Optional for backward-compatibility. */
  token?: string;
  /** Avatar identifier e.g. "female-1" or "male-2" */
  avatar?: string;
};

function read(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function write(user: AuthUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEY);
  }
  window.dispatchEvent(new CustomEvent(EVT));
}

export const auth = {
  get: read,
  signIn(user: AuthUser) {
    write(user);
  },
  signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("happimynd_user_avatar_v1");
    }
    write(null);
  },
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(read());
    setHydrated(true);
    const onChange = () => setUser(read());
    window.addEventListener(EVT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return { user, authed: user !== null, hydrated };
}
