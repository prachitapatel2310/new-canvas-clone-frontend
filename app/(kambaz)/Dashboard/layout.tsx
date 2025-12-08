export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import Session from "../Account/Session";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Session>
      {children}
    </Session>
  );
}