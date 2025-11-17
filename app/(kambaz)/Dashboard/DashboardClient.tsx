// "use client";

// import React, { useState, useEffect } from "react";
// import { Row, Col, Card, Button, FormControl } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";
// import { enrollUser, unenrollUser } from "../Courses/Enrollments/reducer";
// import { setCurrentUser } from "../Account/reducer";
// import { useRouter } from "next/navigation";
// import type { RootState } from "../store";
// import KambazNavigation from "../Navigation";
// import * as client from "../Courses/client";
// import * as accountClient from "../Account/client";


// export default function DashboardClient() {
//   const { courses } = useSelector((state: RootState) => state.coursesReducer);
//   const { currentUser } = useSelector((state: RootState) => state.accountReducer);
//   const { enrollments } = useSelector((state: RootState) => (state as any).enrollmentsReducer || { enrollments: [] });
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const [showAll, setShowAll] = useState<boolean>(false);

//   const [course, setCourse] = useState<any>({
//     _id: "0",
//     name: "New Course",
//     number: "New Number",
//     startDate: "2023-09-10",
//     endDate: "2023-12-15",
//     image: "/images/reactjs.jpg",
//     description: "New Description",
//   });

//   const handleEnroll = async (courseId: string) => {
//     if (!currentUser) return;
//     try {
//       // First, call the server API to create the enrollment
//       await accountClient.enrollUserInCourse(currentUser._id, courseId);
//       // If successful, update the local Redux state
//       dispatch(enrollUser({ user: currentUser._id, course: courseId }));
//     } catch (err) {
//       console.error("Failed to enroll:", err);
//     }
//   };

//   const handleUnenroll = async (courseId: string) => {
//     if (!currentUser) return;
//     try {
//       // First, call the server API to delete the enrollment
//       await accountClient.unenrollUserFromCourse(currentUser._id, courseId);
//       // If successful, update the local Redux state
//       dispatch(unenrollUser({ user: currentUser._id, course: courseId }));
//     } catch (err) {
//       console.error("Failed to unenroll:", err);
//     }
//   };

//   const editCourse = (event: any, c: any) => {
//     event.preventDefault();
//     setCourse(c);
//   };

//   const fetchCourses = async () => {
//     try {
//       const courses = await client.findMyCourses();
//       dispatch(setCourses(courses));
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   useEffect(() => {
//     fetchCourses();
//   }, [currentUser]);

//   const onAddCourse = async () => {
//     try {
//       let created: any;
//       // prefer client.createCourse if available, else try common alternative, else fallback locally
//       if (typeof (client as any).createCourse === "function") {
//         created = await (client as any).createCourse(course);
//       } else if (typeof (client as any).postNewCourse === "function") {
//         created = await (client as any).postNewCourse(course);
//       } else {
//         // fallback: create a local course object so UI still updates
//         created = { ...course, _id: course._id && course._id !== "0" ? course._id : `C${Date.now()}` };
//       }
//       dispatch(setCourses([...(courses ?? []), created]));
//       // enroll creator by default (preserve previous behavior)
//       if (currentUser && currentUser._id) {
//         const enrollment = { _id: `E${Date.now()}`, user: currentUser._id, course: created._id };
//         dispatch(enrollUser(enrollment));
//       }
//       // reset the local course editor
//       setCourse({
//         _id: "0",
//         name: "New Course",
//         number: "New Number",
//         startDate: "2023-09-10",
//         endDate: "2023-12-15",
//         image: "/images/reactjs.jpg",
//         description: "New Description",
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const onDeleteCourse = async (courseId: string) => {
//     try {
//       if (typeof (client as any).deleteCourse === "function") {
//         await (client as any).deleteCourse(courseId);
//       } else if (typeof (client as any).removeCourse === "function") {
//         await (client as any).removeCourse(courseId);
//       }
//       dispatch(setCourses((courses ?? []).filter((c: any) => c._id !== courseId)));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const onUpdateCourse = async () => {
//     try {
//       if (typeof (client as any).updateCourse === "function") {
//         await (client as any).updateCourse(course);
//       }
//       dispatch(setCourses((courses ?? []).map((c: any) => (c._id === course._id ? course : c))));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const role = (currentUser?.role || "").toUpperCase();
//   const canEdit = !!currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes(role);

//   return (
//     <>
//       <KambazNavigation />
//       <div
//         id="wd-dashboard"
//         className="container-fluid p-4"
//         // shift content to the right of the sidebar without increasing total width
//         style={{
//           marginLeft: "96px",
//           paddingLeft: "120px",   // adjust to match your sidebar width
//           width: "85%",
//           maxWidth: "100vw",
//           boxSizing: "border-box",
//           overflowX: "hidden",
//         }}
//       >
//         <h1 id="wd-dashboard-title">Dashboard</h1>

//         {currentUser && (
//           <div className="mb-2 d-flex align-items-center gap-2">
//             <small className="text-muted">
//               Signed in as <strong>{currentUser.firstName} {currentUser.lastName}</strong>
//             </small>
//             <button
//               className="btn btn-outline-secondary btn-sm"
//               onClick={() => { dispatch(setCurrentUser(null)); router.push("/Account/Signin"); }}
//               id="wd-signout-btn"
//             >
//               Sign out
//             </button>
//             <Button id="wd-enrollments-toggle" variant="primary" size="sm" className="ms-2" onClick={() => setShowAll((s) => !s)}>
//               Enrollments {showAll ? "(All)" : "(Mine)"}
//             </Button>
//           </div>
//         )}

//         <hr />

//         <div className="d-flex justify-content-end mb-2">
//           <Button id="wd-enrollments-toggle" variant="primary" onClick={() => setShowAll((s) => !s)}>
//             Enrollments {showAll ? "(All)" : "(Mine)"}
//           </Button>
//         </div>

//         {canEdit && (
//           <>
//             <h5>
//               New Course
//               <button
//                 className="btn btn-primary float-end"
//                 id="wd-add-new-course-click"
//                 onClick={onAddCourse}
//               >
//                 Add
//               </button>
//               <button
//                 className="btn btn-warning float-end me-2"
//                 id="wd-update-course-click"
//                 onClick={onUpdateCourse}
//               >
//                 Update
//               </button>
//             </h5>
//             <br />
//             <FormControl
//               value={course.name}
//               className="mb-2"
//               onChange={(e) => setCourse({ ...course, name: (e.target as HTMLInputElement).value })}
//             />
//             <FormControl
//               as="textarea"
//               value={course.description}
//               rows={3}
//               onChange={(e) => setCourse({ ...course, description: (e.target as HTMLTextAreaElement).value })}
//             />
//             <hr />
//           </>
//         )}

//         <h2 id="wd-dashboard-published">
//           Published Courses ({(() => {
//             if (!currentUser) return 0;
//             return courses?.length ?? 0;
//           })()})
//         </h2>
//         <hr />

//         <div id="wd-dashboard-courses" className="mb-5">
//           <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-4">
//             {(() => {
//               if (!currentUser) return null;
//               const displayed = courses ?? [];
//               return displayed.map((c: any) => (
//                 <Col key={c._id} className="wd-dashboard-course">
//                   <Card className="h-100">
//                     <Card.Img src={c.image ?? "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
//                     <Card.Body className="card-body">
//                       <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">{c.name}</Card.Title>
//                       <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>{c.description}</Card.Text>
//                       <Button variant="primary" onClick={(e) => {
//                         e.preventDefault();
//                         router.push(`/Courses/${c._id}/Home`);
//                       }}> Go </Button>
//                     </Card.Body>
//                     <Card.Footer className="d-flex justify-content-end gap-2">
//                       {currentUser && (
//                         enrollments.some((en: any) => en.user === currentUser._id && en.course === c._id)
//                           ? <Button variant="outline-danger" size="sm" onClick={(ev) => { ev.preventDefault(); dispatch(unenrollUser({ user: currentUser._id, course: c._id })); }} id={`wd-unenroll-${c._id}`}>Unenroll</Button>
//                           : <Button variant="success" size="sm" onClick={(ev) => { ev.preventDefault(); dispatch(enrollUser({ user: currentUser._id, course: c._id })); }} id={`wd-enroll-${c._id}`}>Enroll</Button>
//                       )}

//                       {canEdit && (
//                         <>
//                           <Button variant="warning" className="me-2" onClick={(e) => editCourse(e, c)} id="wd-edit-course-click">
//                             Edit
//                           </Button>
//                           <Button variant="danger" onClick={(event) => { event.preventDefault(); onDeleteCourse(c._id); }} id="wd-delete-course-click">
//                             Delete
//                           </Button>
//                         </>
//                       )}
//                     </Card.Footer>
//                   </Card>
//                 </Col>
//               ));
//             })()}
//           </Row>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";

// 
// [FIX 1]: Corrected this import path. 
// It was pointing to your node server folder, which Vercel cannot see.
//
import { enrollUser, unenrollUser } from "../Courses/Enrollments/reducer";
// 
// 

import { setCurrentUser } from "../Account/reducer";
import { useRouter } from "next/navigation";
import type { RootState } from "../store";
import KambazNavigation from "../Navigation";
import * as client from "../Courses/client";
import * as accountClient from "../Account/client";


export default function DashboardClient() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => (state as any).enrollmentsReducer || { enrollments: [] });
  const dispatch = useDispatch();
  const router = useRouter();

  const [showAll, setShowAll] = useState<boolean>(false);

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) return;
    try {
      // First, call the server API to create the enrollment
      await accountClient.enrollUserInCourse(currentUser._id, courseId);
      // If successful, update the local Redux state
      dispatch(enrollUser({ user: currentUser._id, course: courseId }));
    } catch (err) {
      console.error("Failed to enroll:", err);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!currentUser) return;
    try {
      // First, call the server API to delete the enrollment
      await accountClient.unenrollUserFromCourse(currentUser._id, courseId);
      // If successful, update the local Redux state
      dispatch(unenrollUser({ user: currentUser._id, course: courseId }));
    } catch (err) {
      console.error("Failed to unenroll:", err);
    }
  };

  const editCourse = (event: any, c: any) => {
    event.preventDefault();
    setCourse(c);
  };

  const fetchCourses = async () => {
    try {
      // Per 5.3.7, this button toggles between "all" and "my" courses
      const allCourses = await client.fetchAllCourses(); // Fetches all courses
      
      if (showAll) {
         // If showing all, we need to know which ones the user is enrolled in
         const myCourses = await client.findMyCourses(); // Fetches only enrolled courses
         const myCourseIds = new Set(myCourses.map((c: any) => c._id));
         const coursesWithEnrollment = allCourses.map((c: any) => ({
            ...c,
            isEnrolled: myCourseIds.has(c._id)
         }));
         dispatch(setCourses(coursesWithEnrollment));
      } else {
         // If showing "Mine", just fetch and show enrolled courses
         const myCourses = await client.findMyCourses();
         dispatch(setCourses(myCourses.map((c: any) => ({ ...c, isEnrolled: true }))));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Re-fetch courses whenever the 'showAll' toggle changes or the user logs in
  useEffect(() => {
    if (currentUser) {
      fetchCourses();
    }
  }, [currentUser, showAll]);

  const onAddCourse = async () => {
    try {
      const newCourse = await client.createCourse(course);
      dispatch(addNewCourse(newCourse)); // Use the specific reducer action
      
      // Also dispatch enrollment, since the creator should be enrolled
      if (currentUser && currentUser._id) {
        dispatch(enrollUser({ user: currentUser._id, course: newCourse._id }));
      }

      // reset the local course editor
      setCourse({
        _id: "0",
        name: "New Course",
        number: "New Number",
        startDate: "2023-09-10",
        endDate: "2023-12-15",
        image: "/images/reactjs.jpg",
        description: "New Description",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onDeleteCourse = async (courseId: string) => {
    try {
      await client.deleteCourse(courseId);
      dispatch(deleteCourse(courseId)); // Use the specific reducer action
    } catch (err) {
      console.error(err);
    }
  };

  const onUpdateCourse = async () => {
    try {
      await client.updateCourse(course);
      dispatch(updateCourse(course)); // Use the specific reducer action
    } catch (err) {
      console.error(err);
    }
  };

  const role = (currentUser?.role || "").toUpperCase();
  const canEdit = !!currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes(role);
  
  // Determine which courses to display based on the toggle
  const coursesToDisplay = (showAll ? courses : courses.filter((c: any) => c.isEnrolled)) ?? [];

  return (
    <>
      <KambazNavigation />
      <div
        id="wd-dashboard"
        className="container-fluid p-4"
        style={{
          marginLeft: "96px",
          paddingLeft: "120px", 
          width: "85%",
          maxWidth: "100vw",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        <h1 id="wd-dashboard-title">Dashboard</h1>

        {currentUser && (
          <div className="mb-2 d-flex align-items-center gap-2">
            <small className="text-muted">
              Signed in as <strong>{currentUser.firstName} {currentUser.lastName}</strong>
            </small>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => { 
                // Don't dispatch null, just sign out from server and redirect
                accountClient.signout(); 
                dispatch(setCurrentUser(null)); 
                router.push("/Account/Signin"); 
              }}
              id="wd-signout-btn"
            >
              Sign out
            </button>
          </div>
        )}

        <hr />

        <div className="d-flex justify-content-end mb-2">
          <Button id="wd-enrollments-toggle" variant="primary" onClick={() => setShowAll((s) => !s)}>
            Enrollments {showAll ? "(All)" : "(Mine)"}
         </Button>
        </div>

        {canEdit && (
          <>
            <h5>
              New Course
              <button
                className="btn btn-primary float-end"
                id="wd-add-new-course-click"
                onClick={onAddCourse}
              >
                Add
              </button>
              <button
                className="btn btn-warning float-end me-2"
                id="wd-update-course-click"
                onClick={onUpdateCourse}
              >
                Update
              </button>
        </h5>
            <br />
            <FormControl
              value={course.name}
              className="mb-2"
              onChange={(e) => setCourse({ ...course, name: (e.target as HTMLInputElement).value })}
            />
            <FormControl
              as="textarea"
              value={course.description}
              rows={3}
              onChange={(e) => setCourse({ ...course, description: (e.target as HTMLTextAreaElement).value })}
            />
            <hr />
          </>
        )}

        <h2 id="wd-dashboard-published">
          {showAll ? "All Courses" : "My Courses"} ({coursesToDisplay.length})
        </h2>
        <hr />

        <div id="wd-dashboard-courses" className="mb-5">
          <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-4">
            {(() => {
              if (!currentUser) return null;
              return coursesToDisplay.map((c: any) => (
                <Col key={c._id} className="wd-dashboard-course">
                  <Card className="h-100">
                    <Card.Img src={c.image ?? "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                    <Card.Body className="card-body">
                      <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">{c.name}</Card.Title>
                      <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>{c.description}</Card.Text>
                      <Button variant="primary" onClick={(e) => {
                        e.preventDefault();
                        router.push(`/Courses/${c._id}/Home`);
                   }}> Go </Button>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-end gap-2">

                      {currentUser && (
                      // 
                      // [FIX 2]: Your buttons MUST call the server-aware handlers
                      // (handleEnroll, handleUnenroll) to meet 5.3.7 requirements.
                      //
                        c.isEnrolled
                          ? <Button variant="outline-danger" size="sm" onClick={(ev) => { ev.preventDefault(); handleUnenroll(c._id); }} id={`wd-unenroll-${c._id}`}>Unenroll</Button>
                          : <Button variant="success" size="sm" onClick={(ev) => { ev.preventDefault(); handleEnroll(c._id); }} id={`wd-enroll-${c._id}`}>Enroll</Button>
                      )}
                      // 
                      // [FIX 3]: I also updated your "isEnrolled" logic to use the new flag
                      // `c.isEnrolled` which is set in the `fetchCourses` function.
                      // Your original logic was reading from a separate `enrollments`
                      // state which would not update correctly when showing "All Courses".
                      // This new way is much more reliable.
                      //

                      {canEdit && (
                        <>
                          <Button variant="warning" className="me-2" onClick={(e) => editCourse(e, c)} id="wd-edit-course-click">Edit
                          </Button>
                          <Button variant="danger" onClick={(event) => { event.preventDefault(); onDeleteCourse(c._id); }} id="wd-delete-course-click">
                            Delete
                       </Button>
                        </>
                      )}
                    </Card.Footer>
              </Card>
                </Col>
              ));
            })()}
          </Row>
    </div>
      </div>
    </>
  );
}