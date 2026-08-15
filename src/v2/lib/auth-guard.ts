import { useEffect } from "react";
import { useV2Navigate, type V2NavigateOptions } from "@/v2/lib/router";
import { auth, useAuth } from "@/v2/lib/auth";
import { toast } from "sonner";

/**
 * Checks if the user is authenticated. If not, displays a toast notice
 * and navigates to the login page with a return URL (`redirect`).
 *
 * @returns true if authenticated, false if redirected.
 */
export function checkAuthOrRedirect(
  navigate: (opts: V2NavigateOptions) => void,
  redirectPath?: string,
  message: string = "Please log in or sign up to continue."
): boolean {
  const token = auth.get()?.token;
  if (!token) {
    toast.info(message);
    const target = redirectPath || (typeof window !== "undefined" ? window.location.pathname : "/");
    navigate({
      to: "/login",
      search: { redirect: target },
    });
    return false;
  }
  return true;
}

/**
 * Hook to guard a page component.
 * Redirects unauthenticated users to /login?redirect=<current_path> once hydrated.
 */
export function useProtectedRoute(message: string = "Please log in to access this page.") {
  const navigate = useV2Navigate();
  const { authed, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && !authed) {
      const target = typeof window !== "undefined" ? window.location.pathname : "/";
      toast.info(message);
      navigate({
        to: "/login",
        search: { redirect: target },
        replace: true,
      });
    }
  }, [hydrated, authed, navigate, message]);

  return { authed, hydrated };
}
