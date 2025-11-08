// 'use client';

// import { use } from "react";
// import Modules from "../Modules/page";
// import CourseStatus from "./Status";

// export default function Home({ params }: { params: Promise<{ cid: string }> }) {
//   const { cid } = use(params);
//   return (
//     <div id="wd-home">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Course {cid}</h2>
//       </div>

//       <hr />
//       {/* Flexbox layout for Modules and Status */}
//       <div className="d-flex">
//         {/* Main Content: Modules - Takes most space */}
//         <div className="flex-fill me-4">
//           <Modules />
//         </div>

//         {/* Right Sidebar: Course Status (hidden on medium and smaller screens) */}
//         <div className="d-none d-xl-block">
//           <CourseStatus />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"; // <-- ADD THIS

import { useParams } from "next/navigation"; // <-- IMPORT useParams
import Modules from "../Modules/page";
import CourseStatus from "./Status";

// Change function signature, remove 'use', and use useParams hook
export default function Home() {
  const { cid } = useParams() as { cid: string }; // <-- USE HOOK
  
  return (
    <div id="wd-home">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Use the 'cid' from the hook */}
        <h2>Course {cid}</h2>
      </div>

      <hr />
      {/* This layout is now valid because this is a Client Component */}
      <div className="d-flex">
        <div className="flex-fill me-4">
          <Modules />
        </div>
        <div className="d-none d-xl-block">
          <CourseStatus />
        </div>
      </div>
    </div>
  );
}