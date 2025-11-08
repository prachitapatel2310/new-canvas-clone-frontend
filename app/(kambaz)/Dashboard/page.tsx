import nextDynamic from "next/dynamic";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/*
  Server-side wrapper that defers Dashboard rendering to the client.
  The real Dashboard lives in DashboardClient.tsx (a "use client" component).
*/
const DashboardClient = nextDynamic(() => import("./DashboardClient"), { ssr: false });

export default function Page() {
  return <DashboardClient />;
}