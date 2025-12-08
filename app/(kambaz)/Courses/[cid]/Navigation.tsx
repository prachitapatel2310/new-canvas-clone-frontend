"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CourseNavigationProps {
  cid: string;
}

export default function CourseNavigation({ cid }: CourseNavigationProps) {
  const pathname = usePathname() ?? "";

  // single source of truth for course nav labels
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  return (
    // remove container padding/margin so nav sits flush with adjacent sidebar
    // also add inline styles to override any parent spacing
    <div
      id="wd-courses-navigation"
      className="wd list-group fs-5 rounded-0 p-0 m-0"
      style={{ width: 140, marginLeft: 0, paddingLeft: 0 }}
    >
      {links.map((label) => {
        const href = `/Courses/${cid}/${label}`;
        const isActive =
          label === "Home"
            ? pathname === `/Courses/${cid}` || pathname.startsWith(`/Courses/${cid}/Home`)
            : pathname.startsWith(href);

        const id = `wd-course-${label.toLowerCase()}-link`;
        return (
          // explicitly remove left padding/margin on each item via classes and inline styles
          <Link
            key={id}
            href={href}
            id={id}
            className={`list-group-item border-0 ps-0 pe-0 ms-0 me-0 ${
              isActive ? "wd-active text-black border-start border-4 border-black" : "text-danger"
            }`}
            style={{ paddingLeft: 0, marginLeft: 0 }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}