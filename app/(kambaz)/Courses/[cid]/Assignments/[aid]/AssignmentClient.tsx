"use client";

import { useParams } from "next/navigation";

export default function AssignmentClient() {
  const { aid } = useParams() as { aid?: string };
  return (
    <div>
      <h4>Assignment {aid}</h4>
      <p>Assignment details placeholder</p>
    </div>
  );
}
