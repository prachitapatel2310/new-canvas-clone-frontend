"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CourseNavigationProps {
  cid: string;
}

export default function CourseNavigation({ cid }: CourseNavigationProps) {
  const pathname = usePathname();


  const links = [
    { href: `/Courses/${cid}/Home`, id: "wd-course-home-link", label: "Home" },
    { href: `/Courses/${cid}/Modules`, id: "wd-course-modules-link", label: "Modules" },
    { href: `/Courses/${cid}/Piazza`, id: "wd-course-piazza-link", label: "Piazza" },
    { href: `/Courses/${cid}/Zoom`, id: "wd-course-zoom-link", label: "Zoom" },
    { href: `/Courses/${cid}/Assignments`, id: "wd-course-assignments-link", label: "Assignments" },
    { href: `/Courses/${cid}/Quizzes`, id: "wd-course-quizzes-link", label: "Quizzes" },
    { href: `/Courses/${cid}/Grades`, id: "wd-course-grades-link", label: "Grades" },
    { href: `/Courses/${cid}/People`, id: "wd-course-people-link", label: "People" },
  ];

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.id}
            href={link.href}
            id={link.id}
            className={`list-group-item border-0 ${
              isActive ? "wd-active text-black border-start border-4 border-black" : "text-danger"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );}