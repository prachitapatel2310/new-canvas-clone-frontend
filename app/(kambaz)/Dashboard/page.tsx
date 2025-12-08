// Server wrapper: render the client Dashboard component directly.
// Do NOT export fetchCache/revalidate/generateStaticParams from a server or client file that imports client helpers.
export const dynamic = "force-dynamic";

import DashboardClient from "./DashboardClient";

export default function Page() {
  // Server component can render the client component directly.
  return <DashboardClient />;
}