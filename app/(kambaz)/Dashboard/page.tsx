"use client";

// Prevent Next.js from attempting to prerender this client-heavy page during the static export/build.
export const dynamic = "force-dynamic";

import KambazNavigation from "../Navigation";
import Link from "next/link";
import { Row, Col, Card, Button, FormControl } from "react-bootstrap";
import Margins from "@/app/Labs/Lab2/Margins";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { setCurrentUser } from "../Account/reducer";
import { enrollUser, unenrollUser } from "../Courses/Enrollments/reducer";
import { useRouter } from "next/navigation";
import type { RootState } from "../store";

export default function Dashboard() {
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

  const editCourse = (event: any, c: any) => {
    event.preventDefault();
    setCourse(c);
  };

  return (
    <>
      <div id="wd-dashboard" className="container-fluid p-4" style={{ marginLeft: "100px" }}>
        <h1 id="wd-dashboard-title">Dashboard</h1>
        {currentUser && (
          <div className="mb-2 d-flex align-items-center gap-2">
            <small className="text-muted">Signed in as <strong>{currentUser.firstName} {currentUser.lastName}</strong></small>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => { dispatch(setCurrentUser(null)); router.push('/Account/Signin'); }} id="wd-signout-btn">Sign out</button>
            {/* Enrollments toggle placed next to signout so it's visible on top-right */}
            <Button id="wd-enrollments-toggle" variant="primary" size="sm" className="ms-2" onClick={() => setShowAll((s) => !s)}>
              Enrollments {showAll ? "(All)" : "(Mine)"}
            </Button>
          </div>
        )}
        <hr />
        <div className="d-flex justify-content-end mb-2">
          <Button id="wd-enrollments-toggle" variant="primary" onClick={() => setShowAll((s) => !s)}>
            Enrollments {showAll ? "(All)" : "(Mine)"}
          </Button>
        </div>

        <h5>
          New Course
          <button className="btn btn-primary float-end"
                  id="wd-add-new-course-click"
                  onClick={() => dispatch(addNewCourse(course))} > Add </button>
          <button className="btn btn-warning float-end me-2"
                  id="wd-update-course-click"
                  onClick={() => dispatch(updateCourse(course))} > Update </button>
        </h5>
        <br />
        <FormControl value={course.name} className="mb-2"
          onChange={(e) => setCourse({ ...course, name: e.target.value })} />
        <FormControl as="textarea" value={course.description} rows={3}
          onChange={(e) => setCourse({ ...course, description: e.target.value })} />
        <hr />

        {/* Show count of displayed courses based on current user */}
        <h2 id="wd-dashboard-published">Published Courses ({(() => {
          if (!currentUser) return 0;
          const role = (currentUser.role || "").toUpperCase();
          if (role === "ADMIN" || role === "USER") return courses?.length ?? 0;
          if (showAll) return courses?.length ?? 0;
          // STUDENT or INSTRUCTOR/ FACULTY: compute filtered count
          const filtered = courses?.filter((course: any) => {
            return enrollments.some((enrollment: any) => enrollment.user === currentUser._id && enrollment.course === course._id);
          }) ?? [];
          return filtered.length;
        })()})</h2>
        <hr />

        <div id="wd-dashboard-courses" className="mb-5">
          <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-4">
            {(() => {
              if (!currentUser) return null;
              const role = (currentUser.role || "").toUpperCase();
              let displayed: any[] = [];
              if (role === "ADMIN" || role === "USER" || showAll) {
                displayed = courses ?? [];
              } else {
                // STUDENT / INSTRUCTOR / FACULTY / TA - show only enrolled courses
                displayed = (courses ?? []).filter((course: any) =>
                  enrollments.some((enrollment: any) => enrollment.user === currentUser._id && enrollment.course === course._id)
                );
              }
              const canEdit = (currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser.role || "").toUpperCase()));
              return displayed.map((c: any) => (
              <Col key={c._id} className="wd-dashboard-course" style={{ width: "300px" }}>
                <Card className="h-100">
                  <Card.Img src={c.image ?? "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                  <Card.Body className="card-body">
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">{c.name}</Card.Title>
                    <Card.Text className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>{c.description}</Card.Text>
                    <Button variant="primary" onClick={(e) => {
                      e.preventDefault();
                      const enrolled = enrollments.some((en: any) => en.user === currentUser._id && en.course === c._id);
                      if (enrolled) {
                        router.push(`/Courses/${c._id}/Home`);
                      } else {
                        alert('You are not enrolled in this course.');
                      }
                    }}> Go </Button>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-end gap-2">
                    {currentUser && (
                      (() => {
                        const enrolled = enrollments.some((en: any) => en.user === currentUser._id && en.course === c._id);
                        if (enrolled) {
                          return <Button variant="outline-danger" size="sm" onClick={(ev) => { ev.preventDefault(); dispatch(unenrollUser({ user: currentUser._id, course: c._id })); }} id={`wd-unenroll-${c._id}`}>Unenroll</Button>;
                        }
                        return <Button variant="success" size="sm" onClick={(ev) => { ev.preventDefault(); dispatch(enrollUser({ user: currentUser._id, course: c._id })); }} id={`wd-enroll-${c._id}`}>Enroll</Button>;
                      })()
                    )}

                    {canEdit && (
                      <>
                        <Button variant="warning" className="me-2" onClick={(e) => editCourse(e, c)} id="wd-edit-course-click">Edit</Button>
                        <Button variant="danger" onClick={(event) => { event.preventDefault(); dispatch(deleteCourse(c._id)); }} id="wd-delete-course-click">Delete</Button>
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