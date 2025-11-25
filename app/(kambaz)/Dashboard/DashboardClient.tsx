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
//   const [isLoading, setIsLoading] = useState(true);

//   const [course, setCourse] = useState<any>({
//     _id: "0",
//     name: "New Course",
//     number: "New Number",
//     startDate: "2023-09-10",
//     endDate: "2023-12-15",
//     image: "/images/reactjs.jpg",
//     description: "New Description",
//   });

//   // Check if user is authenticated
//   useEffect(() => {
//     if (currentUser) {
//       console.log("✅ Dashboard: User authenticated as", currentUser.username);
//       setIsLoading(false);
//     } else {
//       // If no current user, it means Session fetched and user is not logged in
//       console.warn("⚠️ Dashboard: No user found, redirecting to signin");
//       router.replace("/Account/Signin");
//     }
//   }, [currentUser, router]);

//   const handleEnroll = async (courseId: string) => {
//     if (!currentUser) return;
//     try {
//       await accountClient.enrollUserInCourse(currentUser._id, courseId);
//       dispatch(enrollUser({ user: currentUser._id, course: courseId }));
//     } catch (err) {
//       console.error("Failed to enroll:", err);
//     }
//   };

//   const handleUnenroll = async (courseId: string) => {
//     if (!currentUser) return;
//     try {
//       await accountClient.unenrollUserFromCourse(currentUser._id, courseId);
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
//       const allCourses = await client.fetchAllCourses();
      
//       if (showAll) {
//         const myCourses = await client.findMyCourses();
//         const myCourseIds = new Set(myCourses.map((c: any) => c._id));
//         const coursesWithEnrollment = allCourses.map((c: any) => ({
//           ...c,
//           isEnrolled: myCourseIds.has(c._id)
//         }));
//         dispatch(setCourses(coursesWithEnrollment));
//       } else {
//         const myCourses = await client.findMyCourses();
//         dispatch(setCourses(myCourses.map((c: any) => ({ ...c, isEnrolled: true }))));
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     if (currentUser) {
//       fetchCourses();
//     }
//   }, [currentUser, showAll]);

//   const onAddCourse = async () => {
//     try {
//       const newCourse = await client.createCourse(course);
//       dispatch(addNewCourse(newCourse));
      
//       if (currentUser && currentUser._id) {
//         dispatch(enrollUser({ user: currentUser._id, course: newCourse._id }));
//       }

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
//       await client.deleteCourse(courseId);
//       dispatch(deleteCourse(courseId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const onUpdateCourse = async () => {
//     try {
//       await client.updateCourse(course);
//       dispatch(updateCourse(course));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleSignout = async () => {
//     try {
//       await accountClient.signout();
//       dispatch(setCurrentUser(null));
//       router.push("/Account/Signin");
//     } catch (err) {
//       console.error("Sign out error:", err);
//     }
//   };

//   const role = (currentUser?.role || "").toUpperCase();
//   const canEdit = !!currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes(role);
  
//   const coursesToDisplay = (showAll ? courses : courses.filter((c: any) => c.isEnrolled)) ?? [];

//   // Show loading state while checking authentication
//   if (isLoading) {
//     return (
//       <div 
//         style={{ 
//           display: "flex", 
//           justifyContent: "center", 
//           alignItems: "center", 
//           minHeight: "100vh",
//           backgroundColor: "#f5f5f5"
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div className="spinner-border mb-3" role="status" style={{ width: "50px", height: "50px" }}>
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p className="text-muted">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // Should not reach here, but if no user, show error
//   if (!currentUser) {
//     return null;
//   }

//   return (
//     <>
//       <KambazNavigation />
//       <div
//         id="wd-dashboard"
//         className="container-fluid p-4"
//         style={{
//           marginLeft: "96px",
//           paddingLeft: "120px",
//           width: "85%",
//           maxWidth: "100vw",
//           boxSizing: "border-box",
//           overflowX: "hidden",
//         }}
//       >
//         <h1 id="wd-dashboard-title">Dashboard</h1>

//         <div className="mb-2 d-flex align-items-center gap-2">
//           <small className="text-muted">
//             Signed in as <strong>{currentUser.firstName} {currentUser.lastName}</strong>
//           </small>
//           <button
//             className="btn btn-outline-secondary btn-sm"
//             onClick={handleSignout}
//             id="wd-signout-btn"
//           >
//             Sign out
//           </button>
//         </div>

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
//           {showAll ? "All Courses" : "My Courses"} ({coursesToDisplay.length})
//         </h2>
//         <hr />

//         <div id="wd-dashboard-courses" className="mb-5">
//           <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-4">
//             {coursesToDisplay.map((c: any) => (
//               <Col key={c._id} className="wd-dashboard-course">
//                 <Card className="h-100">
//                   <Card.Img src={c.image ?? "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
//                   <Card.Body className="card-body">
//                     <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">{c.name}</Card.Title>
//                     <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>{c.description}</Card.Text>
//                     <Button variant="primary" onClick={(e) => {
//                       e.preventDefault();
//                       router.push(`/Courses/${c._id}/Home`);
//                     }}> Go </Button>
//                   </Card.Body>
//                   <Card.Footer className="d-flex justify-content-end gap-2">
//                     {currentUser && (
//                       c.isEnrolled
//                         ? <Button variant="outline-danger" size="sm" onClick={(ev) => { ev.preventDefault(); handleUnenroll(c._id); }} id={`wd-unenroll-${c._id}`}>Unenroll</Button>
//                         : <Button variant="success" size="sm" onClick={(ev) => { ev.preventDefault(); handleEnroll(c._id); }} id={`wd-enroll-${c._id}`}>Enroll</Button>
//                     )}

//                     {canEdit && (
//                       <>
//                         <Button variant="warning" className="me-2" onClick={(e) => editCourse(e, c)} id="wd-edit-course-click">Edit</Button>
//                         <Button variant="danger" onClick={(event) => { event.preventDefault(); onDeleteCourse(c._id); }} id="wd-delete-course-click">Delete</Button>
//                       </>
//                     )}
//                   </Card.Footer>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, Button, FormControl } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";
import { enrollUser, unenrollUser } from "../Courses/Enrollments/reducer";
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
  const hasCheckedSession = useRef(false);

  const [course, setCourse] = useState<any>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  });

  // Only redirect if user explicitly signs out (currentUser goes from having value to null)
  // But NOT on initial load when currentUser might be null before Session fetches
  useEffect(() => {
    if (currentUser === null && hasCheckedSession.current) {
      console.warn("⚠️ Dashboard: User signed out, redirecting to signin");
      router.replace("/Account/Signin");
    } else if (currentUser) {
      hasCheckedSession.current = true;
    }
  }, [currentUser, router]);

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) return;
    try {
      await accountClient.enrollUserInCourse(currentUser._id, courseId);
      dispatch(enrollUser({ user: currentUser._id, course: courseId }));
    } catch (err) {
      console.error("Failed to enroll:", err);
    }
  };

  const handleUnenroll = async (courseId: string) => {
    if (!currentUser) return;
    try {
      await accountClient.unenrollUserFromCourse(currentUser._id, courseId);
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
      const allCourses = await client.fetchAllCourses();
      
      if (showAll) {
        const myCourses = await client.findMyCourses();
        const myCourseIds = new Set(myCourses.map((c: any) => c._id));
        const coursesWithEnrollment = allCourses.map((c: any) => ({
          ...c,
          isEnrolled: myCourseIds.has(c._id)
        }));
        dispatch(setCourses(coursesWithEnrollment));
      } else {
        const myCourses = await client.findMyCourses();
        dispatch(setCourses(myCourses.map((c: any) => ({ ...c, isEnrolled: true }))));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log("✅ Dashboard: User logged in as", currentUser.username);
      fetchCourses();
    }
  }, [currentUser, showAll]);

  const onAddCourse = async () => {
    try {
      const newCourse = await client.createCourse(course);
      dispatch(addNewCourse(newCourse));
      
      if (currentUser && currentUser._id) {
        dispatch(enrollUser({ user: currentUser._id, course: newCourse._id }));
      }

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
      dispatch(deleteCourse(courseId));
    } catch (err) {
      console.error(err);
    }
  };

  const onUpdateCourse = async () => {
    try {
      await client.updateCourse(course);
      dispatch(updateCourse(course));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignout = async () => {
    try {
      await accountClient.signout();
      dispatch(setCurrentUser(null));
      router.push("/Account/Signin");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const role = (currentUser?.role || "").toUpperCase();
  const canEdit = !!currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes(role);
  
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
              onClick={handleSignout}
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
            {coursesToDisplay.map((c: any) => (
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
                      c.isEnrolled
                        ? <Button variant="outline-danger" size="sm" onClick={(ev) => { ev.preventDefault(); handleUnenroll(c._id); }} id={`wd-unenroll-${c._id}`}>Unenroll</Button>
                        : <Button variant="success" size="sm" onClick={(ev) => { ev.preventDefault(); handleEnroll(c._id); }} id={`wd-enroll-${c._id}`}>Enroll</Button>
                    )}

                    {canEdit && (
                      <>
                        <Button variant="warning" className="me-2" onClick={(e) => editCourse(e, c)} id="wd-edit-course-click">Edit</Button>
                        <Button variant="danger" onClick={(event) => { event.preventDefault(); onDeleteCourse(c._id); }} id="wd-delete-course-click">Delete</Button>
                      </>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
}
