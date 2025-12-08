"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function Breadcrumb({ course }: { course?: { name: string; _id?: string } }) {
  const pathname = usePathname() ?? "";
  const parts = pathname.split("/").filter(Boolean);
  const last = parts.length ? parts[parts.length - 1] : "";
  const section = (last === "Courses" || last === course?._id || last === "") ? "Home" : last;
  // inline span so it can be placed directly in the header
  return (
    <span className="ms-2">
      {course?.name ?? "Course"} &nbsp;&gt;&nbsp; {section}
    </span>
  );
}
