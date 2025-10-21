'use client';

import { ReactNode, use } from 'react';
import { FaAlignJustify } from 'react-icons/fa6';
import CourseNavigation from './Navigation';
import { courses } from '../../Database';
import Breadcrumb from './Breadcrumb';
import Kambaz from '../../page';
import KambazNavigation from '../../Navigation';

interface CoursesLayoutProps {
  children: ReactNode;
  params: Promise<{ cid: string }>;
}

export default function CoursesLayout({ children, params }: CoursesLayoutProps) {
  const { cid } = use(params);
  const course = courses.find((c) => c._id === cid);

  return (
    <div className="d-flex" id="wd-courses">
      <KambazNavigation />
      {/* Course Navigation */}
      <div className="d-none d-md-block" style={{ marginLeft: '130px' }}>
        <CourseNavigation cid={cid} />
      </div>

      {/* Main content */}
      {/* add left margin to account for the course nav width (~250px).
          Parent layout already offsets by 120px for the Kambaz nav, so
          this results in total left offset ≈ 120 + 250 = 370px */}
      <div className="flex-fill" style={{ marginLeft: '0px' }}>
        <h2 className="text-danger d-flex align-items-center">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          <Breadcrumb course={course} />
        </h2>
        {children}
      </div>
    </div>
  );
}
