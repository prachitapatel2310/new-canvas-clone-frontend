"use client";
import { useParams } from "next/navigation";
export default function AddPathParameters() {
  const { a, b } = useParams();
  const ai = parseInt(a as string, 10);
  const bi = parseInt(b as string, 10);
  return (
    <div id="wd-add-path-parameters">
      <h4>Add Path Parameters</h4>
      {a} + {b} = {Number.isNaN(ai) || Number.isNaN(bi) ? "N/A" : ai + bi}
    </div>
  );
}
