export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import CourseLayoutClient from "./CourseLayoutClient";

export default function CourseLayout({ children }: { children: ReactNode }) {
  return <CourseLayoutClient>{children}</CourseLayoutClient>;
}