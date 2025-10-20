"use client";
import { useParams } from "next/navigation";
import * as db from "../../../Database";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";

function ModuleControlButtons() {
  return (
    <span className="float-end">
      <button className="btn btn-sm btn-light me-1">⋯</button>
      <button className="btn btn-sm btn-outline-light">Edit</button>
    </span>
  );
}

function LessonControlButtons() {
  return (
    <span className="float-end">
      <button className="btn btn-sm btn-light me-1">⋯</button>
    </span>
  );
}

export default function ModulesPage() {
  const { cid } = useParams() as { cid?: string };
  const modules = (db as any).modules || [];

  const courseModules = modules.filter((m: any) => m.course === cid);

  return (
    <div id="wd-modules-page">
      <h3>Modules</h3>
      <hr />
      <ListGroup id="wd-modules" className="rounded-0">
        {courseModules.map((module: any) => (
          <ListGroupItem key={module.id} className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary text-white">
              <BsGripVertical className="me-2 fs-3" /> {module.name} <ModuleControlButtons />
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroupItem key={lesson.id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name} <LessonControlButtons />
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
        {courseModules.length === 0 && <div className="text-muted p-3">No modules found for this course.</div>}
      </ListGroup>
    </div>
  );
}