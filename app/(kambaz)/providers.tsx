"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";

/**
 * Client-only Providers wrapper that lazy-loads the app store.
 * - Avoids importing the runtime store on the server (prevents prerender errors).
 * - Loads the store module only on the client and mounts react-redux Provider.
 */
export default function Providers({ children }: { children: ReactNode }) {
  // On the server, bail out early (this component won't run server-side because of "use client")
  // but keep the guard to be explicit.
  if (typeof window === "undefined") return <>{children}</>;

  const [clientStore, setClientStore] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    // dynamically import the store from the local (kambaz) store file
    import("./store")
      .then((mod) => {
        const m: any = mod;
        // support default export or named exports
        const s = m?.default ?? m?.store ?? m;
        if (mounted) setClientStore(s);
      })
      .catch((err) => {
        // keep component resilient; log to console so you can see errors in the browser
        // but don't throw during render
        // eslint-disable-next-line no-console
        console.error("Failed to load store dynamically:", err);
        if (mounted) setClientStore(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Don't render children that rely on Redux until the store is available.
  // Render children unwrapped if you prefer a different UX (e.g., a loader).
  if (!clientStore) return <>{children}</>;

  return <Provider store={clientStore}>{children}</Provider>;
}