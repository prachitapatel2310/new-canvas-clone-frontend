'use client';

import { ReactNode, use } from 'react';
import { FaAlignJustify } from 'react-icons/fa6';
import KambazNavigation from '../../Navigation';
import CourseNavigation from './Navigation';
import { courses } from '../../Database';
import Breadcrumb from './Breadcrumb';

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
      <div className="flex-fill">
        <h2 className="text-danger d-flex align-items-center">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          <Breadcrumb course={course} />
        </h2>
        {children}
      </div>
    </div>
  );
}
