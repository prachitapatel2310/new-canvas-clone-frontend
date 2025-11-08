"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";

// minimal client layout: shows course nav area and children
export default function CourseLayoutClient({ 
  children 
}: Readonly<{ children: ReactNode }>) {
  const { cid } = useParams() as { cid?: string };
  return (
    <div className="d-flex">
      <div style={{ width: 250, borderRight: "1px solid #dee2e6", padding: 10 }}>
        <h5>Course {cid}</h5>
        {/* ...course navigation could go here... */}
      </div>
      <div className="flex-fill p-4">
        {children}
      </div>
    </div>
  );
}