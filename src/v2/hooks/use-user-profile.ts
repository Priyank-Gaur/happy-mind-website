import { useEffect, useState } from "react";
import { fetchProfile } from "@/v2/lib/auth-api";
import { auth, type AuthUser } from "@/v2/lib/auth";

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
};

/**
 * Custom hook to automatically fetch user profile details (Name, Email, Phone)
 * from the Profile API (`/api/v1/get-profile`), reusing auth state.
 */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const localUser = auth.get();
    return {
      name: localUser?.name || "",
      email: localUser?.email || "",
      phone: "",
    };
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const localUser = auth.get();
    const token = localUser?.token;

    if (!token) {
      // If no API token present, fallback to local auth user info
      setProfile({
        name: localUser?.name || "Guest User",
        email: localUser?.email || "guest@happimynd.com",
        phone: "+91 98765 43210", // Fallback placeholder if unauthenticated demo
      });
      setLoading(false);
      return;
    }

    let isMounted = true;

    fetchProfile(token)
      .then((res) => {
        if (!isMounted) return;
        const d: Record<string, any> = (res as any)?.data ?? res;
        const name = d?.nickname || d?.name || localUser?.name || "";
        const email = d?.email || localUser?.email || "";
        const phone = d?.mobile || d?.phone || d?.mobile_number || "";

        setProfile({
          name: name || "User",
          email: email || "",
          phone: phone || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("[useUserProfile] Profile API error:", err);
        setError("Failed to load profile details");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, loading, error };
}
