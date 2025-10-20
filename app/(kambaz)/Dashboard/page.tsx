"use client";

import KambazNavigation from "../Navigation";
import Link from "next/link";
import * as db from "../Database";
import { Row, Col, Card, Button } from "react-bootstrap";
import Margins from "@/app/Labs/Lab2/Margins";

export default function Dashboard() {
  const courses = db.courses;
  return (
    <>
      <KambazNavigation />
    <div id="wd-dashboard" className="container-fluid p-4" style={{ marginLeft: "120px" }}>
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div id="wd-dashboard-courses" className="mb-5">
        <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-4">
          {courses.map((course) => (
            <Col
              key={course._id}
              className="wd-dashboard-course"
              style={{ width: "300px" }}
            >
              <Card className="h-100">
                <Link
                  href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark"
                >
                  {/* use course-specific image, fallback to a default */}
                  <Card.Img
                    src={course.image ?? "/images/reactjs.jpg"}
                    variant="top"
                    width="100%"
                    height={160}
                  />
                  <Card.Body className="card-body">
                    <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name}
                    </Card.Title>
                    <Card.Text
                      className="wd-dashboard-course-description overflow-hidden"
                      style={{ height: "100px" }}
                    >
                      {course.description}
                    </Card.Text>
                    <Button variant="primary"> Go </Button>
                  </Card.Body>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
    </>
  );
}
