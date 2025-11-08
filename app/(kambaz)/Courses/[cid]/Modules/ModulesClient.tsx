"use client";

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import type { RootState } from "../../../store";
import { useState } from "react";
import { ListGroup, Button } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";

export default function ModulesClient() {
  const { cid } = useParams() as { cid?: string };
  const dispatch = useDispatch();

  // modules come from the modulesReducer slice
  const modules = useSelector((state: RootState) => (state as any).modulesReducer?.modules ?? []);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = (courses ?? []).find((c: any) => c._id === cid);

  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState("");

  // action creator - adjust name/path if your reducer exports a different function
  const addModuleAction = (m: any) => ({ type: "modules/addModule", payload: m });

  const addModule = () => {
    if (!moduleName?.trim()) return;
    const newModule = {
      _id: `M${Date.now()}`,
      title: moduleName.trim(),
      course: cid,
    };
    dispatch(addModuleAction(newModule));
    setModuleName("");
  };

  return (
    <div>
      <h3>Modules for {course?.name ?? `Course ${cid}`}</h3>

      <div className="mb-3">
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Add Module
        </Button>
      </div>

      <ListGroup>
        {modules
          .filter((m: any) => m.course === cid)
          .map((m: any) => (
            <ListGroup.Item key={m._id}>
              {m.title ?? m.name ?? "Untitled Module"}
            </ListGroup.Item>
          ))}
      </ListGroup>

      <ModuleEditor
        show={showModal}
        handleClose={() => setShowModal(false)}
        dialogTitle="Add Module"
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={() => {
          addModule();
          setShowModal(false);
        }}
      />
    </div>
  );
}
