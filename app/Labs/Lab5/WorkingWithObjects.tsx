// Labs/Lab5/WorkingWithObjects.tsx

"use client";

import React, { useState } from "react";

// Define the environment variable at the top
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState<any>(null);
  const [assignmentTitle, setAssignmentTitle] = useState<string>("");
  const [moduleObj, setModuleObj] = useState<any>(null);

  const [moduleNameInput, setModuleNameInput] = useState<string>("");
  const [moduleDescInput, setModuleDescInput] = useState<string>("");

  const [scoreInput, setScoreInput] = useState<number | "">("");
  const [completedInput, setCompletedInput] = useState<boolean>(false);

  // Updated to use the external HTTP_SERVER variable
  const fetchJson = async (path: string) => {
    // Construct the full URL using HTTP_SERVER and the path
    const url = `${HTTP_SERVER}${path}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  return (
    <div className="p-4">
      <h2>Working With Objects (Lab5)</h2>

      <section className="mb-4">
        <h4>Assignment</h4>
        <div className="mb-2">
          <button
            className="btn btn-outline-primary me-2"
            onClick={async () => {
              try {
                // Use the path here
                const res = await fetchJson("/lab5/assignment");
                setAssignment(res);
              } catch (e) {
                alert(String(e));
              }
            }}
          >
            Get Assignment
          </button>

          <button
            className="btn btn-outline-secondary me-2"
            onClick={async () => {
              try {
                // Use the path here
                const res = await fetchJson("/lab5/assignment/title");
                setAssignmentTitle(res);
              } catch (e) {
                alert(String(e));
              }
            }}
          >
            Get Assignment Title
          </button>
        </div>

        <div className="mb-2 d-flex align-items-center gap-2">
          <label className="mb-0">Score</label>
          <input
            type="number"
            className="form-control w-auto"
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={async () => {
              if (scoreInput === "") return alert("Enter a score");
              try {
                const res = await fetchJson(`/lab5/assignment/score/${encodeURIComponent(String(scoreInput))}`);
                setAssignment(res);
              } catch (e) {
                alert(String(e));
              }
            }}
          >
            Update Score
          </button>

          <label className="mb-0 ms-3">Completed</label>
          <input
            type="checkbox"
            className="form-check-input"
            checked={completedInput}
            onChange={(e) => setCompletedInput(e.target.checked)}
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={async () => {
              try {
                const res = await fetchJson(`/lab5/assignment/completed/${completedInput}`);
                setAssignment(res);
              } catch (e) {
                alert(String(e));
              }
            }}
          >
            Update Completed
          </button>
        </div>

        <div className="mt-2">
          <strong>Assignment state:</strong>
          <pre>{assignment ? JSON.stringify(assignment, null, 2) : "Not loaded"}</pre>
          <strong>Assignment title:</strong> <span>{assignmentTitle || "Not loaded"}</span>
        </div>
      </section>

      <section className="mb-4">
        <h4>Module</h4>
        <div className="mb-2">
          <button
            className="btn btn-outline-primary me-2"
            onClick={async () => {
              try {
                const res = await fetchJson("/lab5/module");
                setModuleObj(res);
              } catch (e) {
                alert(String(e));
              }
            }}
          >
            Get Module
          </button>

          <button
            className="btn btn-outline-secondary me-2"
            onClick={async () => {
              try {
                const name = await fetchJson("/lab5/module/name");
                setModuleObj((prev: any) => ({ ...(prev || {}), name }));
              } catch (e) {
                alert(String(e));
              }
            }}
          >
            Get Module Name
          </button>
        </div>

        <div className="mb-2 d-flex align-items-center gap-2">
          <label className="mb-0">New Module Name</label>
          <input
            type="text"
            className="form-control w-auto"
            value={moduleNameInput}
            onChange={(e) => setModuleNameInput(e.target.value)}
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={async () => {
              if (!moduleNameInput) return alert("Enter a module name");
              try {
                const res = await fetchJson(`/lab5/module/name/${encodeURIComponent(moduleNameInput)}`);
                setModuleObj(res);
                setModuleNameInput("");
              } catch (e) {
                alert(String(e));
              }
            }}
          >
            Update Module Name
          </button>
        </div>

        <div className="mb-2 d-flex align-items-center gap-2">
          <label className="mb-0">New Module Description</label>
          <input
            type="text"
            className="form-control w-auto"
            value={moduleDescInput}
            onChange={(e) => setModuleDescInput(e.target.value)}
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={async () => {
              if (!moduleDescInput) return alert("Enter a module description");
              try {
                const res = await fetchJson(`/lab5/module/description/${encodeURIComponent(moduleDescInput)}`);
                setModuleObj(res);
                setModuleDescInput("");
              } catch (e) {
                alert(String(e));
              }
            }}
          >
            Update Description
          </button>
        </div>

        <div className="mt-2">
          <strong>Module state:</strong>
          <pre>{moduleObj ? JSON.stringify(moduleObj, null, 2) : "Not loaded"}</pre>
        </div>
      </section>
    </div>
  );
}