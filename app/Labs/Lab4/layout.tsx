"use client";
export const dynamic = "force-dynamic";

import { ReactNode } from "react";

export default function Lab4Layout({ children }: { children: ReactNode }) {
  // Simple client-only shell for Lab4 pages.
  return <>{children}</>;
}
