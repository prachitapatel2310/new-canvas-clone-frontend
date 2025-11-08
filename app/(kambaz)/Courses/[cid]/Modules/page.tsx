"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, FormControl } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store";
import { addModule, deleteModule, updateModule, editModule } from "./reducer";

export default function ModulesPage() {
  const { cid } = useParams() as { cid?: string };
  const [moduleName, setModuleName] = useState("");

  const { modules } = useSelector((state: RootState) => state.modulesReducer as any);
  const dispatch = useDispatch();
  const d = dispatch as any; // avoid strict action typing issues in this simple example

  const courseModules = (modules || []).filter((m: any) => m.course === cid);

  return (
    <div id="wd-modules-page">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Modules</h3>
        <ModulesControls
          moduleName={moduleName}
          setModuleName={setModuleName}
          addModule={() => {
            d((addModule as any)({ name: moduleName, course: cid }));
            setModuleName("");
          }}
        />
      </div>
      <hr />

      <ListGroup id="wd-modules" className="rounded-0">
        {courseModules.map((module: any) => (
          <ListGroupItem key={module.id} className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary text-white">
              <BsGripVertical className="me-2 fs-3" />
              {!module.editing && module.name}
              {module.editing && (
                <FormControl
                  className="w-50 d-inline-block"
                  onChange={(e) => d((updateModule as any)({ ...module, name: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      d((updateModule as any)({ ...module, editing: false }));
                    }
                  }}
                  defaultValue={module.name}
                />
              )}
                <ModuleControlButtons
                  moduleId={module.id}
                  deleteModule={(moduleId: string) => d((deleteModule as any)(moduleId))}
                  editModule={(moduleId: string) => d((editModule as any)(moduleId))}
                />
            </div>

            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroupItem key={lesson.id} className="wd-lesson p-3 ps-1">
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}
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