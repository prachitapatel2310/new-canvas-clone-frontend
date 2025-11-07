"use client";

import ReduxProvider from "@/lib/redux/ReduxProvider";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  // Delegate to the client-only ReduxProvider implemented under /lib so the
  // Redux store module is never imported in server-rendered contexts.
  return <ReduxProvider>{children}</ReduxProvider>;
}