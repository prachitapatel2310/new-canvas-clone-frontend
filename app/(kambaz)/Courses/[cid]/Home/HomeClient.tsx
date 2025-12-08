"use client";

import { useParams } from "next/navigation";
import Modules from "../Modules/page";
import CourseStatus from "./Status";

export default function HomeClient() {
  const { cid } = useParams() as { cid?: string };

  return (
    <div id="wd-home">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Course {cid}</h2>
      </div>

      <hr />
      {/* Flexbox layout for Modules and Status */}
      <div className="d-flex">
        {/* Main Content: Modules - Takes most space */}
        <div className="flex-fill me-4">
          <Modules />
        </div>

        {/* Right Sidebar: Course Status (hidden on medium and smaller screens) */}
        <div className="d-none d-xl-block">
          <CourseStatus />
        </div>
      </div>
    </div>
  );
}
