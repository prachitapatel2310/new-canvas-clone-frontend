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
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((label) => {
        // build href (Home still uses /Home route; Dashboard/other code may consider /Courses/:cid as Home too)
        const href = `/Courses/${cid}/${label}`;
        // Treat "Home" as active for both /Courses/:cid and /Courses/:cid/Home
        const isActive =
          label === "Home"
            ? pathname === `/Courses/${cid}` || pathname.startsWith(`/Courses/${cid}/Home`)
            : pathname.startsWith(href);

        const id = `wd-course-${label.toLowerCase()}-link`;
        return (
          <Link
            key={id}
            href={href}
            id={id}
            className={`list-group-item border-0 ${
              isActive ? "wd-active text-black border-start border-4 border-black" : "text-danger"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );}