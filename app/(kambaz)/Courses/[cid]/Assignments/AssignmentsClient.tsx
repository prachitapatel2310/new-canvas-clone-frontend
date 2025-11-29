// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { ListGroup, ListGroupItem, Button, Row, Col, Form } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import type { RootState } from "../../../store";
// import { 
//   deleteAssignment,
//   setAssignments, // <-- IMPORT THIS ACTION
// } from "../../Assignments/reducer";

// // 1. IMPORT THE CLIENT API FUNCTIONS
// import * as client from "../../Assignments/client"; 

// export default function AssignmentsClient() {
//   const { cid } = useParams() as { cid?: string };
  
//   // The assignments will now populate after the API call finishes
// const assignments = useSelector((state: RootState) => (state.assignmentsReducer as any).assignments) || [];  
//   const { currentUser } = useSelector((state: RootState) => state.accountReducer);
//   const dispatch = useDispatch();
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true); // <--- New loading state

//   const canEdit = currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser.role ?? "").toUpperCase());

//   // ==========================================================
//   // 2. FETCH DATA FROM SERVER ON LOAD
//   // ==========================================================
//   const fetchAssignments = async () => {
//     if (!cid) return; // Guard clause if cid is not available yet
//     setLoading(true);
//     try {
//       // Calls the backend API route: /api/courses/:cid/assignments
//       const fetchedAssignments = await client.findAssignmentsForCourse(cid);
      
//       // DISPATCH THE FETCHED DATA TO REDUX STORE
//       dispatch(setAssignments(fetchedAssignments)); 

//     } catch (error) {
//       console.error("Error fetching assignments:", error);
//       // Handle error display if necessary
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Run the fetch function only once when the component mounts (or when cid changes)
//   useEffect(() => {
//     // ✅ THE FIX: Only call fetchAssignments if the local Redux store is currently empty.
//     // If the store already has assignments, it means we either just came from the editor 
//     // (with fresh data) or successfully loaded them before.
//     if (cid && assignments.length === 0) {
//       fetchAssignments();
//     } else {
//       // If we have data, we can stop the loading spinner instantly.
//       setLoading(false);
//     }
//   }, [cid, assignments.length]);
  
//   // Your local filtering logic is correct since the store is now populated.
//   const courseAssignments = assignments
//     .filter((a: any) => a.course === cid)
//     .filter((a: any) => a.title.toLowerCase().includes(search.trim().toLowerCase()));

//   // ==========================================================
//   // 3. UPDATE DELETE FUNCTION TO CALL SERVER
//   // ==========================================================
//   const handleDelete = async (assignmentId: string) => {
//     if (confirm('Are you sure you want to delete this assignment?')) {
//       try {
//         await client.deleteAssignment(assignmentId); // <-- Call server API to delete
//         dispatch(deleteAssignment(assignmentId)); // <-- Only update redux on success
//       } catch (error) {
//         console.error("Error deleting assignment:", error);
//         alert("Failed to delete assignment on server.");
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-4">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <span className="ms-2">Loading Assignments...</span>
//       </div>
//     );
//   }

//   // ==========================================================
//   // 4. UPDATE RETURN STATEMENT
//   // ==========================================================
//   return (
//     <div id="wd-assignments-page">
//       <h1><b>Course {cid}</b></h1>
//       <hr />
//       <Row>
//         <Col md={12} sm={12}>
//           <div id="wd-assignments">
//             <div id="wd-assignments-container">
//               {/* Search bar and buttons */}
//               {/* ... (rest of your search/button section remains the same) ... */}
//               <Form.Control
//                 placeholder="Search for Assignments"
//                 id="wd-search-assignment"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="mb-2"
//               />

//               <div className="mb-3">
//                 <Button id="wd-add-assignment-group" size="sm" className="me-2">+ Group</Button>
//                 {canEdit && (
//                   <Link href={`/Courses/${cid}/Assignments/new`} id="wd-add-assignment" className="btn btn-sm btn-primary">+ Assignment</Link>
//                 )}
//               </div>
              
//               <h3 id="wd-assignments-title">
//                 ASSIGNMENTS <small className="text-muted">({courseAssignments.length})</small>
//               </h3>

//               <ListGroup id="wd-assignment-list" className="mt-3">
//                 {courseAssignments.map((a: any) => (
//                   <ListGroupItem key={a._id} className="wd-assignment-list-item p-3 d-flex justify-content-between align-items-start">
//                     <div>
//                       <Link href={`/Courses/${cid}/Assignments/${a._id}`} className="wd-assignment-link h5 text-decoration-none">
//                         {a.title}
//                       </Link>
//                       <div className="text-muted mt-1">
//                         Multiple Modules | <b>Due</b> {a.due} | <b>Points</b> {a.maxPoints}
//                       </div>
//                     </div>
//                     {/* Container for buttons */}
//                     <div className="d-flex gap-2">
//                       {canEdit && (
//                         <>
//                           {/* EDIT BUTTON */}
//                           <Link href={`/Courses/${cid}/Assignments/${a._id}`} className="btn btn-outline-primary btn-sm" id={`wd-edit-assignment-${a._id}`}>
//                             Edit
//                           </Link>
                          
//                           {/* DELETE BUTTON */}
//                           {/* Call the new handler function */}
//                           <Button variant="outline-danger" size="sm" onClick={() => handleDelete(a._id)} id={`wd-delete-assignment-${a._id}`}>
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </ListGroupItem>
//                 ))}

//                 {courseAssignments.length === 0 && (
//                   <div className="text-muted p-3">No assignments for this course.</div>
//                 )}
//               </ListGroup>
//             </div>
//           </div>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// // 5. Provide the necessary API client and Redux setup below
// // (These are separate files, but shown here for completeness)

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ListGroup, ListGroupItem, Button, Row, Col, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store";
import { 
  deleteAssignment,
  setAssignments, // Imports action to populate the store with fetched data
} from "../../Assignments/reducer";

// Imports the client API functions for server interaction
import * as client from "../../Assignments/client"; 

export default function AssignmentsClient() {
  const { cid } = useParams() as { cid?: string };
  
  // Assignments state is read from the Redux store
  const assignments = useSelector((state: RootState) => (state.assignmentsReducer as any).assignments) || []; 
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true); // Manages loading state

  const canEdit = currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser.role ?? "").toUpperCase());

  /**
   * Fetches assignments for the current course from the server.
   */
  const fetchAssignments = async () => {
    if (!cid) return;
    setLoading(true);
    try {
      // Calls the backend API route: /api/courses/:cid/assignments
      const fetchedAssignments = await client.findAssignmentsForCourse(cid);
      
      // Dispatches the fetched data to the Redux store
      dispatch(setAssignments(fetchedAssignments)); 

    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to load data on component mount or course change
  useEffect(() => {
    // Only call fetchAssignments if the Redux store is empty to avoid redundant calls 
    // when navigating back from the editor (which typically updates the store).
    if (cid && assignments.length === 0) {
      fetchAssignments();
    } else {
      setLoading(false);
    }
    // Dependency array ensures data loads when cid changes or assignments state is initially empty
  }, [cid, assignments.length, dispatch]);
  
  // Filters assignments by course ID and search term
  const courseAssignments = assignments
    .filter((a: any) => a.course === cid)
    .filter((a: any) => a.title.toLowerCase().includes(search.trim().toLowerCase()));

  /**
   * Handles deleting an assignment by calling the API and then updating Redux.
   */
  const handleDelete = async (assignmentId: string) => {
    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        await client.deleteAssignment(assignmentId); // Call server API to delete
        dispatch(deleteAssignment(assignmentId)); // Update redux store on success
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("Failed to delete assignment on server.");
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading Assignments...</span>
      </div>
    );
  }

  return (
    <div id="wd-assignments-page">
      <h1><b>Course {cid}</b></h1>
      <hr />
      <Row>
        <Col md={12} sm={12}>
          <div id="wd-assignments">
            <div id="wd-assignments-container">
              
              <Form.Control
                placeholder="Search for Assignments"
                id="wd-search-assignment"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-2"
              />

              <div className="mb-3">
                <Button id="wd-add-assignment-group" size="sm" className="me-2">+ Group</Button>
                {canEdit && (
                  // Link to the editor page for creating a new assignment
                  <Link href={`/Courses/${cid}/Assignments/new`} id="wd-add-assignment" className="btn btn-sm btn-primary">+ Assignment</Link>
                )}
              </div>
              
              <h3 id="wd-assignments-title">
                ASSIGNMENTS <small className="text-muted">({courseAssignments.length})</small>
              </h3>

              <ListGroup id="wd-assignment-list" className="mt-3">
                {courseAssignments.map((a: any) => (
                  <ListGroupItem key={a._id} className="wd-assignment-list-item p-3 d-flex justify-content-between align-items-start">
                    <div>
                      {/* Link to the editor page for editing the existing assignment */}
                      <Link href={`/Courses/${cid}/Assignments/${a._id}`} className="wd-assignment-link h5 text-decoration-none">
                        {a.title}
                      </Link>
                      <div className="text-muted mt-1">
                        Multiple Modules | <b>Due</b> {a.due} | <b>Points</b> {a.maxPoints}
                      </div>
                    </div>
                    
                    <div className="d-flex gap-2">
                      {canEdit && (
                        <>
                          {/* EDIT BUTTON */}
                          <Link href={`/Courses/${cid}/Assignments/${a._id}`} className="btn btn-outline-primary btn-sm" id={`wd-edit-assignment-${a._id}`}>
                            Edit
                          </Link>
                          
                          {/* DELETE BUTTON */}
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={() => handleDelete(a._id)} 
                            id={`wd-delete-assignment-${a._id}`}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </ListGroupItem>
                ))}

                {courseAssignments.length === 0 && (
                  <div className="text-muted p-3">No assignments for this course.</div>
                )}
              </ListGroup>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}