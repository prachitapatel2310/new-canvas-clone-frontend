export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import AccountLayoutClient from "./AccountLayoutClient";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountLayoutClient>{children}</AccountLayoutClient>;
}
