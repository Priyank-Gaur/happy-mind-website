import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
/* The backend (Laravel) normally serves this site, so the app calls it with
 * same-origin paths. In dev there is no backend behind Vite, so those paths
 * return index.html and the CSRF handshake fails. Set VITE_DEV_API_PROXY to a
 * backend origin to forward them instead — off by default, so `npm run dev`
 * never talks to a live environment unless you ask it to.
 *
 *   VITE_DEV_API_PROXY=https://happimynd.com npm run dev
 */
const apiProxy = (target: string) => ({
  target,
  changeOrigin: true,
  secure: true,
  // Re-scope Set-Cookie to localhost, or the browser drops the session cookie
  cookieDomainRewrite: "",
});

export default defineConfig(({ mode }) => {
  const proxyTarget = process.env.VITE_DEV_API_PROXY;

  return {
  server: {
    host: "::",
    port: 8080,
    proxy: proxyTarget
      ? {
          "/sanctum": apiProxy(proxyTarget),
          "/api": apiProxy(proxyTarget),
          "/submit-contact": apiProxy(proxyTarget),
        }
      : undefined,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});
