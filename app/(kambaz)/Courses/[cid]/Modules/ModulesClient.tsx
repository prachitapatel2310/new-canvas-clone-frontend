"use client";

import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
import type { RootState } from "../../../store";

export default function ModulesClient() {
  const { cid } = useParams() as { cid?: string };
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = (courses ?? []).find((c: any) => c._id === cid);

  return (
    <div>
      <h3>Modules for {course?.name ?? `Course ${cid}`}</h3>
      {/* ...list modules if available... */}
      <p>Modules content</p>
    </div>
  );
}
