import { QueryClient } from "@tanstack/react-query";

/**
 * Single shared QueryClient instance for the whole app.
 *
 * Exported as its own module (rather than created inline in App.tsx) so
 * non-component code — specifically auth.ts's signIn/signOut — can clear
 * cached queries on login/logout. Without this, query keys like
 * ["assessment", "checkifany"] aren't scoped per user, so switching accounts
 * without a full page reload kept showing the previous account's cached
 * data (e.g. the HappiLIFE progress bar) until something happened to
 * refetch it.
 */
export const queryClient = new QueryClient();
