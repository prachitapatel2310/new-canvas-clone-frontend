import nextDynamic from "next/dynamic";

// CRITICAL: Prevent any static generation
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// This disables static generation for this route
export async function generateStaticParams() {
  return []; // No static paths
}

const DashboardClient = nextDynamic(() => import("./DashboardClient"), {
  ssr: false,
  loading: () => (
    <div className="container-fluid p-4">
      <h1>Loading Dashboard...</h1>
    </div>
  ),
});

export default function Page() {
  return <DashboardClient />;
}