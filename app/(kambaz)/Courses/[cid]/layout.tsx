'use client';

import { ReactNode, use } from 'react';
import KambazNavigation from '../../Navigation';
import CourseNavigation from './Navigation';

interface CoursesLayoutProps {
  children: ReactNode;
  params: Promise<{ cid: string }>;
}

export default function CoursesLayout({ children, params }: CoursesLayoutProps) {
  const { cid } = use(params);

  return (
    <div className="d-flex">
      
        <KambazNavigation />
      

      {/* Course Navigation */}
      <div className="d-none d-md-block" style={{ marginLeft: '130px' }}>
        <CourseNavigation cid={cid} />
      </div>

      {/* Main content */}
      <div className="flex-fill">
        {children}
      </div>
    </div>
  );
}
