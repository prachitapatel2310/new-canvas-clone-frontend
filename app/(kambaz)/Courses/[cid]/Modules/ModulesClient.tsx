// "use client";

// import { useSelector, useDispatch } from "react-redux";
// import { useParams } from "next/navigation";
// import type { RootState, AppDispatch } from "../../../store";
// import { useState, useEffect } from "react";
// import { ListGroup, Button, Dropdown } from "react-bootstrap";
// import ModuleEditor from "./ModuleEditor";
// import { BsGripVertical } from "react-icons/bs";
// import { FaPlus, FaTrash, FaPencilAlt, FaCheckCircle, FaEllipsisV } from "react-icons/fa";
// import * as client from "../../client";

// export default function ModulesClient() {
//   const { cid } = useParams() as { cid?: string };
//   const dispatch = useDispatch<AppDispatch>(); // use typed dispatch

//   const modules = useSelector((state: RootState) => (state as any).modulesReducer?.modules ?? []);
//   const { courses } = useSelector((state: RootState) => state.coursesReducer);
//   const course = (courses ?? []).find((c: any) => c._id === cid); // course._id is correct here

//   const [showModal, setShowModal] = useState(false);
//   const [moduleName, setModuleName] = useState("");
//   const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

//   const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
//   // Helper accessors to unify id/_id differences
//   const moduleId = (m: any) => m?.id ?? m?._id;
//   const lessonId = (l: any) => l?.id ?? l?._id;

//   // fetch modules for this course from the server and populate reducer
//   useEffect(() => {
//     const fetchModules = async () => {
//       if (!cid) return;
//       try {
//         const mods =
//           typeof (client as any).findModulesForCourse === "function"
//             ? await (client as any).findModulesForCourse(cid)
//             : [];
//         dispatch({ type: "modules/setModules", payload: mods });
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchModules();
//   }, [cid, dispatch]);

//   // Server returns modules scoped to the course, use them directly
//   const displayedModules = modules ?? [];

//   // Add Module (create both id & _id so reducer variants work)
//   // Create module on server and add created module to reducer
//   const onCreateModuleForCourse = async () => {
//     if (!cid || !moduleName?.trim()) return;
//     try {
//       const newModulePayload = { name: moduleName.trim(), course: cid };
//       const created =
//         typeof (client as any).createModuleForCourse === "function"
//           ? await (client as any).createModuleForCourse(cid, newModulePayload)
//           : { ...newModulePayload, id: `M${Date.now()}`, _id: `M${Date.now()}`, lessons: [] };
//       // dispatch into reducer so modules state is updated
//       dispatch({ type: "modules/setModules", payload: [...(modules ?? []), created] });
//       setModuleName("");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEditModule = (moduleIdValue: string) => {
//     const mod = modules.find((m: any) => moduleId(m) === moduleIdValue);
//     if (mod) {
//       setModuleName(mod.name);
//       setEditingModuleId(moduleIdValue);
//       setShowModal(true);
//     }
//   };

//   // Replace previous local update with server-backed update
//   const handleUpdateModule = async () => {
//     if (!moduleName?.trim() || !editingModuleId) return;
//     const mod = modules.find((m: any) => moduleId(m) === editingModuleId);
//     if (!mod) {
//       setModuleName("");
//       setEditingModuleId(null);
//       return;
//     }

//     const updatedModule = { ...mod, name: moduleName.trim(), id: moduleId(mod), _id: moduleId(mod) };

//     try {
//       if (typeof (client as any).updateModule === "function") {
//         // send update to server
//         await (client as any).updateModule(updatedModule);
//       } else {
//         console.warn("client.updateModule not available; performing client-side update only.");
//       }
//       // update reducer state with the updated module
//       const next = (modules ?? []).map((m: any) =>
//         moduleId(m) === moduleId(updatedModule) ? updatedModule : m
//       );
//       dispatch({ type: "modules/setModules", payload: next });
//     } catch (err) {
//       console.error("Failed to update module:", err);
//       alert("Could not update module. See console for details.");
//     }

//     setModuleName("");
//     setEditingModuleId(null);
//   };

//   const toggleCollapse = (id: string) => setCollapsed(s => ({ ...s, [id]: !s[id] }));

//   const collapseAll = () => {
//     const anyExpanded = displayedModules.some((m: any) => !collapsed[moduleId(m)]);
//     const next: Record<string, boolean> = {};
//     displayedModules.forEach((m: any) => (next[moduleId(m)] = anyExpanded));
//     setCollapsed(next);
//   };

//   // New: remove module handler - calls server, then updates reducer state
//   const onRemoveModule = async (mid: string) => {
//     if (!mid) return;
//     if (!confirm("Delete module and all its lessons?")) return;
//     try {
//       if (typeof (client as any).deleteModule === "function") {
//         await (client as any).deleteModule(mid);
//       } else {
//         // fallback: no-op server side, proceed with client-side removal
//         console.warn("client.deleteModule not available; performing client-side removal only.");
//       }
//       // filter modules using moduleId accessor to handle id/_id
//       const next = (modules ?? []).filter((m: any) => moduleId(m) !== mid);
//       dispatch({ type: "modules/setModules", payload: next });
//     } catch (err) {
//       console.error("Failed to delete module:", err);
//       alert("Could not delete module. See console for details.");
//     }
//   };

//   return (
//     <div>
//       {/* Controls Bar */}
//       <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
//         <Button variant="secondary" size="sm" onClick={collapseAll}>
//           Collapse All
//         </Button>
//         <Button variant="secondary" size="sm">
//           View Progress
//         </Button>
        
//         <Dropdown>
//           <Dropdown.Toggle variant="secondary" size="sm">
//             <FaCheckCircle className="text-success me-1" />
//             Publish All
//           </Dropdown.Toggle>
//           <Dropdown.Menu>
//             <Dropdown.Item>Publish all</Dropdown.Item>
//             <Dropdown.Item>Unpublish all</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>

//         <Button 
//           variant="danger" 
//           size="sm"
//           onClick={() => {
//             setEditingModuleId(null);
//             setModuleName("");
//             setShowModal(true);
//           }}
//         >
//           <FaPlus className="me-1" />
//           Module
//         </Button>
//       </div>

//       {/* Modules List */}
//       <div className="d-flex flex-column gap-1">
//         {/* Map over courseModules directly. All modules use 'id' */}
//         {displayedModules.map((m: any) => {
//           const mid = moduleId(m);
//           const lessons = Array.isArray(m.lessons) ? m.lessons : [];
//           const isCollapsed = !!collapsed[mid];

//           return (
//             <div key={mid} className="border rounded-0">
//               {/* Module Header */}
//               <div
//                 className="d-flex align-items-center justify-content-between p-3"
//                 style={{ backgroundColor: "#f5f5f5" }}
//               >
//                 <div className="d-flex align-items-center">
//                   <BsGripVertical className="me-2 text-muted" />
//                   <strong>{m.name ?? "Untitled Module"}</strong>
//                 </div>
                
//                 <div className="d-flex align-items-center gap-2">
//                   <FaPencilAlt
//                     className="text-secondary cursor-pointer"
//                     style={{ cursor: "pointer" }}
//                     onClick={() => handleEditModule(mid)}
//                     title="Edit module"
//                   />
//                   <FaTrash
//                     className="text-danger cursor-pointer"
//                     style={{ cursor: "pointer" }}
//                     title="Delete module"
//                     onClick={() => {
//                       // call new handler that removes on server and updates reducer
//                       onRemoveModule(mid);
//                     }}
//                   />
//                   <FaCheckCircle className="text-success" title="Published" />
//                   <FaPlus
//                     className="text-secondary cursor-pointer"
//                     style={{ cursor: "pointer" }}
//                     title="Add item (implement later)"
//                   />
//                   <FaEllipsisV className="text-secondary" />
//                   <button
//                     className="btn btn-sm btn-link text-dark p-0"
//                     onClick={() => toggleCollapse(mid)}
//                     style={{ fontSize: "1.2rem", textDecoration: "none" }}
//                   >
//                     {isCollapsed ? "▶" : "▼"}
//                   </button>
//                 </div>
//               </div>

//               {/* Module Items/Lessons */}
//               {!isCollapsed && (
//                 <ListGroup variant="flush">
//                   {lessons.length ? (
//                     lessons.map((lesson: any, idx: number) => {
//                       const lid = lessonId(lesson);
//                       return (
//                         <ListGroup.Item
//                           key={lid ?? idx}
//                           className="d-flex align-items-center justify-content-between"
//                           style={{ borderLeft: "4px solid #28a745", paddingLeft: "1rem" }}
//                         >
//                           <div className="d-flex align-items-center">
//                             <BsGripVertical className="me-2 text-muted" />
//                             <span>{lesson.name ?? `Lesson ${idx + 1}`}</span>
//                           </div>
                          
//                           <div className="d-flex align-items-center gap-2">
//                             <FaPencilAlt className="text-secondary" style={{ cursor: "pointer" }} />
//                             <FaTrash
//                               className="text-danger"
//                               style={{ cursor: "pointer" }}
//                               title="Delete lesson"
//                               onClick={() => {
//                                 if (!confirm(`Delete lesson "${lesson.name}"?`)) return;
//                                 // Preferred specific lesson delete action (if reducer supports it)
//                                 dispatch({
//                                   type: "modules/deleteLesson",
//                                   payload: { moduleId: mid, lessonId: lid }
//                                 });
//                               }}
//                             />
//                             <FaCheckCircle className="text-success" />
//                             <FaPlus className="text-secondary" style={{ cursor: "pointer" }} />
//                             <FaEllipsisV className="text-secondary" />
//                           </div>
//                         </ListGroup.Item>
//                       );
//                     })
//                   ) : (
//                     <ListGroup.Item className="text-muted text-center">
//                       No lessons in this module
//                     </ListGroup.Item>
//                   )}
//                 </ListGroup>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       <ModuleEditor
//         show={showModal}
//         handleClose={() => {
//           setShowModal(false);
//           setEditingModuleId(null);
//           setModuleName("");
//         }}
//         dialogTitle={editingModuleId ? "Edit Module" : "Add Module"}
//         moduleName={moduleName}
//         setModuleName={setModuleName}
//         addModule={async () => {
//           if (editingModuleId) {
//             await handleUpdateModule(); // ensure we call server-backed update when editing
//           } else {
//             await onCreateModuleForCourse();
//           }
//           setShowModal(false);
//         }}
//       />
//     </div>
//   );
// }

"use client";

import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import type { RootState, AppDispatch } from "../../../store";
import { useState, useEffect } from "react";
import { ListGroup, Button, Dropdown } from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaTrash, FaPencilAlt, FaCheckCircle, FaEllipsisV } from "react-icons/fa";
import * as client from "../../client";

export default function ModulesClient() {
  const { cid } = useParams() as { cid?: string };
  const dispatch = useDispatch<AppDispatch>(); // use typed dispatch

  const modules = useSelector((state: RootState) => (state as any).modulesReducer?.modules ?? []);
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const course = (courses ?? []).find((c: any) => c._id === cid); // course._id is correct here

  const [showModal, setShowModal] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  // Helper accessors to unify id/_id differences
  const moduleId = (m: any) => m?.id ?? m?._id;
  const lessonId = (l: any) => l?.id ?? l?._id;

  // fetch modules for this course from the server and populate reducer
  useEffect(() => {
    const fetchModules = async () => {
      if (!cid) return;
      try {
        const mods =
          typeof (client as any).findModulesForCourse === "function"
            ? await (client as any).findModulesForCourse(cid)
            : [];
        dispatch({ type: "modules/setModules", payload: mods });
      } catch (err) {
        console.error(err);
      }
    };
    fetchModules();
  }, [cid, dispatch]);

  // Server returns modules scoped to the course, use them directly
  const displayedModules = modules ?? [];

  // Add Module (create both id & _id so reducer variants work)
  // Create module on server and add created module to reducer
  const onCreateModuleForCourse = async () => {
    if (!cid || !moduleName?.trim()) return;
    try {
      const newModulePayload = { name: moduleName.trim(), course: cid };
      const created =
        typeof (client as any).createModuleForCourse === "function"
          ? await (client as any).createModuleForCourse(cid, newModulePayload)
          : { ...newModulePayload, id: `M${Date.now()}`, _id: `M${Date.now()}`, lessons: [] };
      // dispatch into reducer so modules state is updated
      dispatch({ type: "modules/setModules", payload: [...(modules ?? []), created] });
      setModuleName("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditModule = (moduleIdValue: string) => {
    const mod = modules.find((m: any) => moduleId(m) === moduleIdValue);
    if (mod) {
      setModuleName(mod.name);
      setEditingModuleId(moduleIdValue);
      setShowModal(true);
    }
  };

  // Replace previous local update with server-backed update
  const handleUpdateModule = async () => {
    if (!moduleName?.trim() || !editingModuleId || !cid) return; // Add cid guard
    const mod = modules.find((m: any) => moduleId(m) === editingModuleId);
    if (!mod) {
      setModuleName("");
      setEditingModuleId(null);
      return;
    }

    // Pass cid to the client function
    const updatedModule = { ...mod, name: moduleName.trim(), id: moduleId(mod), _id: moduleId(mod) };

    try {
      if (typeof (client as any).updateModule === "function") {
        // REFACTORED: Pass cid to updateModule
        const savedModule = await (client as any).updateModule(cid, updatedModule); 
        // update reducer state with the response from server
        const next = (modules ?? []).map((m: any) =>
          moduleId(m) === moduleId(savedModule) ? savedModule : m
        );
        dispatch({ type: "modules/setModules", payload: next });
      } else {
        console.warn("client.updateModule not available; performing client-side update only.");
        // Client-side update fallback (retained but less preferred)
        const next = (modules ?? []).map((m: any) =>
          moduleId(m) === moduleId(updatedModule) ? updatedModule : m
        );
        dispatch({ type: "modules/setModules", payload: next });
      }
    } catch (err) {
      console.error("Failed to update module:", err);
      alert("Could not update module. See console for details.");
    }

    setModuleName("");
    setEditingModuleId(null);
  };

  const toggleCollapse = (id: string) => setCollapsed(s => ({ ...s, [id]: !s[id] }));

  const collapseAll = () => {
    const anyExpanded = displayedModules.some((m: any) => !collapsed[moduleId(m)]);
    const next: Record<string, boolean> = {};
    displayedModules.forEach((m: any) => (next[moduleId(m)] = anyExpanded));
    setCollapsed(next);
  };

  // New: remove module handler - calls server, then updates reducer state
  const onRemoveModule = async (mid: string) => {
    if (!mid || !cid) return; // Add cid guard
    if (!confirm("Delete module and all its lessons?")) return;
    try {
      if (typeof (client as any).deleteModule === "function") {
        // REFACTORED: Pass cid and mid to deleteModule
        await (client as any).deleteModule(cid, mid); 
      } else {
        // fallback: no-op server side, proceed with client-side removal
        console.warn("client.deleteModule not available; performing client-side removal only.");
      }
      // filter modules using moduleId accessor to handle id/_id
      const next = (modules ?? []).filter((m: any) => moduleId(m) !== mid);
      dispatch({ type: "modules/setModules", payload: next });
    } catch (err) {
      console.error("Failed to delete module:", err);
      alert("Could not delete module. See console for details.");
    }
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
        {/* Map over courseModules directly. All modules use 'id' */}
        {displayedModules.map((m: any) => {
          const mid = moduleId(m);
          const lessons = Array.isArray(m.lessons) ? m.lessons : [];
          const isCollapsed = !!collapsed[mid];

          return (
            <div key={mid} className="border rounded-0">
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
                    onClick={() => handleEditModule(mid)}
                    title="Edit module"
                  />
                  <FaTrash
                    className="text-danger cursor-pointer"
                    style={{ cursor: "pointer" }}
                    title="Delete module"
                    onClick={() => {
                      // call new handler that removes on server and updates reducer
                      onRemoveModule(mid);
                    }}
                  />
                  <FaCheckCircle className="text-success" title="Published" />
                  <FaPlus
                    className="text-secondary cursor-pointer"
                    style={{ cursor: "pointer" }}
                    title="Add item (implement later)"
                  />
                  <FaEllipsisV className="text-secondary" />
                  <button
                    className="btn btn-sm btn-link text-dark p-0"
                    onClick={() => toggleCollapse(mid)}
                    style={{ fontSize: "1.2rem", textDecoration: "none" }}
                  >
                    {isCollapsed ? "▶" : "▼"}
                  </button>
                </div>
              </div>

              {/* Module Items/Lessons */}
              {!isCollapsed && (
                <ListGroup variant="flush">
                  {lessons.length ? (
                    lessons.map((lesson: any, idx: number) => {
                      const lid = lessonId(lesson);
                      return (
                        <ListGroup.Item
                          key={lid ?? idx}
                          className="d-flex align-items-center justify-content-between"
                          style={{ borderLeft: "4px solid #28a745", paddingLeft: "1rem" }}
                        >
                          <div className="d-flex align-items-center">
                            <BsGripVertical className="me-2 text-muted" />
                            <span>{lesson.name ?? `Lesson ${idx + 1}`}</span>
                          </div>
                          
                          <div className="d-flex align-items-center gap-2">
                            <FaPencilAlt className="text-secondary" style={{ cursor: "pointer" }} />
                            <FaTrash
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                              title="Delete lesson"
                              onClick={() => {
                                if (!confirm(`Delete lesson "${lesson.name}"?`)) return;
                                // Preferred specific lesson delete action (if reducer supports it)
                                dispatch({
                                  type: "modules/deleteLesson",
                                  payload: { moduleId: mid, lessonId: lid }
                                });
                              }}
                            />
                            <FaCheckCircle className="text-success" />
                            <FaPlus className="text-secondary" style={{ cursor: "pointer" }} />
                            <FaEllipsisV className="text-secondary" />
                          </div>
                        </ListGroup.Item>
                      );
                    })
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
        addModule={async () => {
          if (editingModuleId) {
            await handleUpdateModule(); // ensure we call server-backed update when editing
          } else {
            await onCreateModuleForCourse();
          }
          setShowModal(false);
        }}
      />
    </div>
  );
}