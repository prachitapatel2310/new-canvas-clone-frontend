"use client";

import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import type { RootState } from "../../../store";

export default function HomeClient() {
  const { cid } = useParams() as { cid?: string };
  const router = useRouter();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = (courses ?? []).find((c: any) => c._id === cid);

  return (
    <div>
      <h2>{course ? course.name : `Course ${cid}`}</h2>
      <p>{course?.description}</p>
      <button className="btn btn-primary" onClick={() => router.push(`/Courses/${cid}/Home`)}>Go to Home</button>
    </div>
  );
}
