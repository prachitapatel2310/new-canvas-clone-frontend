"use client";

import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "@/lib/redux/store";

/**
 * Client-only Providers wrapper.
 * On the server this file is not executed (because of "use client"),
 * but the store module itself is server-safe (see lib/redux/store.ts).
 */
export default function Providers({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}