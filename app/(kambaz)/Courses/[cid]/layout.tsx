"use client";

import { ReactNode, useState } from "react";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import type { RootState } from "@/lib/redux/store";
import Offcanvas from "react-bootstrap/Offcanvas";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const cid = params?.cid as string;

  const { courses } = useSelector((state: RootState) => state.coursesReducer ?? { courses: [] });
  const course = courses?.find((c: any) => c._id === cid);

  // controls visibility of the md+ sidebar. Small-screen will use an Offcanvas.
  const [showNav, setShowNav] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  // layout offsets (matches parent Kambaz nav offset + course nav width)
  const baseKambazOffset = 120; // left offset from the Kambaz navigation
     const courseNavOffset = 140; // width reserved for the course navigation on md+ (match CSS width)

  return (
    <>
      <div id="wd-courses" style={{ marginLeft: "20px" }}>
        {/* Header: hamburger + breadcrumb */}
        <div className="d-flex align-items-center">
          <FaAlignJustify
            className="me-4 fs-4 mb-1"
            onClick={() => {
              // on small screens open Offcanvas, otherwise toggle md+ sidebar
              try {
                if (window.matchMedia && window.matchMedia("(max-width: 767.98px)").matches) {
                  setShowOffcanvas(true);
                } else {
                  setShowNav((s) => !s);
                }
              } catch (e) {
                setShowNav((s) => !s);
              }
            }}
            style={{ cursor: "pointer" }}
            role="button"
            aria-pressed={!showNav}
            aria-label="Toggle course navigation"
          />
          <h2 className="mb-0">
            <Breadcrumb course={course} />
          </h2>
        </div>

        <hr />

        {/* Content area: left = course nav (md+), right = main children */}
        <div className="d-flex">
          {showNav && (
            <div className="d-none d-md-block" style={{ width: `${courseNavOffset}px`, marginRight: "20px" }}>
              <CourseNavigation cid={cid} />
            </div>
          )}

          <div className="flex-fill">{children}</div>
        </div>
      </div>

      {/* Offcanvas for small screens */}
      <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Course Navigation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <CourseNavigation cid={cid} />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

// "use client";

// import { ReactNode, use, useState } from "react";
// import { FaAlignJustify } from "react-icons/fa6";
// import CourseNavigation from "./Navigation";
// import Breadcrumb from "./Breadcrumb";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store";

// interface CoursesLayoutProps {
//   children: ReactNode;
//   params: Promise<{ cid: string }>;
// }

// export default function CoursesLayout({ children, params }: CoursesLayoutProps) {
//   const { cid } = use(params);
//   const { courses } = useSelector((state: RootState) => state.coursesReducer);
//   const course = courses.find((c: any) => c._id === cid);
  
//   // State to toggle course navigation visibility
//   const [showNav, setShowNav] = useState(true);

//   return (
//     <div className="d-flex" id="wd-courses">
//       {/* Course Navigation - conditionally rendered */}
//       {showNav && (
//         <div className="d-none d-md-block" style={{ marginLeft: '130px' }}>
//           <CourseNavigation cid={cid} />
//         </div>
//       )}

//       {/* Main content */}
//       <div className="flex-fill" style={{ marginLeft: showNav ? '0px' : '130px' }}>
//         <h2 className="text-danger d-flex align-items-center">
//           {/* Toggle icon - clickable */}
//           <FaAlignJustify 
//             className="me-4 fs-4 mb-1" 
//             onClick={() => setShowNav(!showNav)}
//             style={{ cursor: 'pointer' }}
//           />
//           <Breadcrumb course={course} />
//         </h2>
//         {children}
//       </div>
//     </div>
//   );
// }