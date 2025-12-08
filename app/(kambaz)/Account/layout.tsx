export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import AccountLayoutClient from "./AccountLayoutClient";
import Session from "./Session";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <Session>
      <AccountLayoutClient>{children}</AccountLayoutClient>
    </Session>
  );
}
