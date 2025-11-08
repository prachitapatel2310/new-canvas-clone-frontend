"use client";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { RootState } from "../../../store";

export default function AssignmentsClient() {
  const { cid } = useParams() as { cid?: string };
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = (courses ?? []).find((c: any) => c._id === cid);

  return (
    <div>
      <h3>Assignments for {course?.name ?? cid}</h3>
      <p>Assignment list placeholder</p>
      <button className="btn btn-sm btn-outline-primary" onClick={() => router.push(`/Courses/${cid}/Assignments/1`)}>Open assignment 1</button>
    </div>
  );
}
