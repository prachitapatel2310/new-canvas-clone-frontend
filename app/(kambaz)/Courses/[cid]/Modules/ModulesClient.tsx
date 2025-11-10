"use client";

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import type { RootState } from "../../../store";
import { useState, useMemo } from "react";
import { ListGroup, Button, Dropdown } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaTrash, FaPencilAlt, FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import { addModule, deleteModule, updateModule } from "./reducer";

export default function ModulesClient() {
  const { cid } = useParams() as { cid?: string };
  const dispatch = useDispatch();

  const modules = useSelector((state: RootState) => (state as any).modulesReducer?.modules ?? []);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = (courses ?? []).find((c: any) => c._id === cid);

  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  // track removed ids locally so UI updates immediately (optimistic delete)
  const [removedIds, setRemovedIds] = useState<Record<string, true>>({});

  const courseModules = useMemo(
    () => modules.filter((m: any) => m.course === cid),
    [modules, cid]
  );
  const displayedModules = useMemo(
    () => courseModules.filter((m: any) => !removedIds[m._id]),
    [courseModules, removedIds]
  );

  const handleAddModule = () => {
    if (!moduleName?.trim()) return;
    const newModule = {
      _id: `M${Date.now()}`,
      name: moduleName.trim(),
      course: cid,
      lessons: [
        { _id: `L${Date.now()}-1`, name: "Introduction to the topic", module: `M${Date.now()}` },
        { _id: `L${Date.now()}-2`, name: "Learn the basics", module: `M${Date.now()}` },
        { _id: `L${Date.now()}-3`, name: "Practice exercises", module: `M${Date.now()}` },
      ],
    };
    // dispatch a plain action object to avoid action-creator typing mismatch
    dispatch({ type: "modules/addModule", payload: newModule } as any);
    setModuleName("");
  };

  const handleEditModule = (moduleId: string) => {
    const module = modules.find((m: any) => m._id === moduleId);
    if (module) {
      setModuleName(module.name);
      setEditingModuleId(moduleId);
      setShowModal(true);
    }
  };

  const handleUpdateModule = () => {
    if (!moduleName?.trim() || !editingModuleId) return;
    const module = modules.find((m: any) => m._id === editingModuleId);
    if (module) {
      dispatch(updateModule({ ...module, name: moduleName.trim() }));
    }
    setModuleName("");
    setEditingModuleId(null);
  };

  const toggleCollapse = (id: string) => setCollapsed((s) => ({ ...s, [id]: !s[id] }));
  
  const collapseAll = () => {
    const anyExpanded = courseModules.some((m: any) => !collapsed[m._id]);
    const next: Record<string, boolean> = {};
    courseModules.forEach((m: any) => (next[m._id] = anyExpanded));
    setCollapsed(next);
  };

  return (
    <div>
      {/* Controls Bar */}
      <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
        <Button variant="secondary" size="sm" onClick={collapseAll}>
          Collapse All
        </Button>
        <Button variant="secondary" size="sm">
          View Progress
        </Button>
        
        <Dropdown>
          <Dropdown.Toggle variant="secondary" size="sm">
            <FaCheckCircle className="text-success me-1" />
            Publish All
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Publish all</Dropdown.Item>
            <Dropdown.Item>Unpublish all</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Button 
          variant="danger" 
          size="sm"
          onClick={() => {
            setEditingModuleId(null);
            setModuleName("");
            setShowModal(true);
          }}
        >
          <FaPlus className="me-1" />
          Module
        </Button>
      </div>

      {/* Modules List */}
      <div className="d-flex flex-column gap-1">
        {displayedModules.map((m: any) => {
          const lessons = m.lessons ?? [];
          const isCollapsed = !!collapsed[m._id];

          return (
            <div key={m._id} className="border rounded-0">
              {/* Module Header */}
              <div
                className="d-flex align-items-center justify-content-between p-3"
                style={{ backgroundColor: "#f5f5f5" }}
              >
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-2 text-muted" />
                  <strong>{m.name ?? "Untitled Module"}</strong>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <FaPencilAlt
                    className="text-secondary cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditModule(m._id)}
                    title="Edit module"
                  />
                  <FaTrash
                    className="text-danger cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (!confirm(`Delete module "${m.name}"? This cannot be undone.`)) return;
                      // Optimistic UI: only hide this specific module (and its lessons).
                      // Do NOT call reducer delete actions here to avoid wiping all modules
                      // if the reducer/action creator is mis-implemented.
                      setRemovedIds((s) => ({ ...s, [m._id]: true }));
                      // If you want persistence later, replace the line above with a
                      // safe action once the reducer/action creator is corrected.
                    }}
                    title="Delete module"
                  />
                  <FaCheckCircle className="text-success" title="Published" />
                  <FaPlus
                    className="text-secondary cursor-pointer"
                    style={{ cursor: "pointer" }}
                    title="Add item"
                  />
                  <FaEllipsisV className="text-secondary" />
                  <button
                    className="btn btn-sm btn-link text-dark p-0"
                    onClick={() => toggleCollapse(m._id)}
                    style={{ fontSize: "1.2rem", textDecoration: "none" }}
                  >
                    {isCollapsed ? "▶" : "▼"}
                  </button>
                </div>
              </div>

              {/* Module Items/Lessons */}
              {!isCollapsed && (
                <ListGroup variant="flush">
                  {lessons.length > 0 ? (
                    lessons.map((lesson: any, idx: number) => (
                      <ListGroup.Item
                        key={lesson._id ?? idx}
                        className="d-flex align-items-center justify-content-between"
                        style={{
                          borderLeft: "4px solid #28a745",
                          paddingLeft: "1rem",
                        }}
                      >
                        <div className="d-flex align-items-center">
                          <BsGripVertical className="me-2 text-muted" />
                          <span>{lesson.name ?? `Lesson ${idx + 1}`}</span>
                        </div>
                        
                        <div className="d-flex align-items-center gap-2">
                          <FaPencilAlt className="text-secondary" style={{ cursor: "pointer" }} />
                          <FaTrash className="text-danger" style={{ cursor: "pointer" }} />
                          <FaCheckCircle className="text-success" />
                          <FaPlus className="text-secondary" style={{ cursor: "pointer" }} />
                          <FaEllipsisV className="text-secondary" />
                        </div>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item className="text-muted text-center">
                      No lessons in this module
                    </ListGroup.Item>
                  )}
                </ListGroup>
              )}
            </div>
          );
        })}
      </div>

      <ModuleEditor
        show={showModal}
        handleClose={() => {
          setShowModal(false);
          setEditingModuleId(null);
          setModuleName("");
        }}
        dialogTitle={editingModuleId ? "Edit Module" : "Add Module"}
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={() => {
          if (editingModuleId) {
            handleUpdateModule();
          } else {
            handleAddModule();
          }
          setShowModal(false);
        }}
      />
    </div>
  );
}