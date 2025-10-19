"use client";

import KambazNavigation from "../Navigation";
import Link from "next/link";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  CardImg,
  Button,
  Row,
  Col,
} from "react-bootstrap";

export default function Dashboard() {
  return (
    <div id="wd-dashboard" className="container-fluid p-4">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      <h2 id="wd-dashboard-published">Published Courses (7)</h2>
      <hr />

      <div id="wd-dashboard-courses" className="mb-5">
        <Row xs={1} md={2} lg={3} xl={4} xxl={5} className="g-4">
              {/* Course 1 - React JS */}
              <Col className="wd-dashboard-course">
                <Card className="h-100">
                  <Link
                    href="/Courses/0123"
                    className="text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="https://placehold.co/300x160/4A90E2/FFFFFF?text=React+JS"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title">
                        CS1234 React JS
                      </CardTitle>
                      <CardText className="wd-dashboard-course-title">
                        Full Stack software developer
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 2 - HTML and CSS */}
              <Col className="wd-dashboard-course">
                <Card className="h-100">
                  <Link
                    href="/Courses/4567"
                    className="text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="https://placehold.co/300x160/E67E22/FFFFFF?text=HTML+CSS"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title">
                        CS5678 HTML and CSS
                      </CardTitle>
                      <CardText className="wd-dashboard-course-title">
                        Frontend web developer
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 3 - Java */}
              <Col className="wd-dashboard-course">
                <Card className="h-100">
                  <Link
                    href="/Courses/8910"
                    className="text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="https://placehold.co/300x160/E74C3C/FFFFFF?text=Java"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title">
                        CS8910 Java
                      </CardTitle>
                      <CardText className="wd-dashboard-course-title">
                        Java programming for beginners
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 4 - Machine Learning */}
              <Col className="wd-dashboard-course">
                <Card className="h-100">
                  <Link
                    href="/Courses/1112"
                    className="text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="https://placehold.co/300x160/9B59B6/FFFFFF?text=Machine+Learning"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title">
                        CS1112 Machine Learning
                      </CardTitle>
                      <CardText className="wd-dashboard-course-title">
                        Machine Learning for beginners
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 5 - Python */}
              <Col className="wd-dashboard-course">
                <Card className="h-100">
                  <Link
                    href="/Courses/1314"
                    className="text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="https://placehold.co/300x160/27AE60/FFFFFF?text=Python"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title">
                        CS1314 Python Programming
                      </CardTitle>
                      <CardText className="wd-dashboard-course-title">
                        Python programming fundamentals
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 6 - Database Design */}
              <Col className="wd-dashboard-course">
                <Card className="h-100">
                  <Link
                    href="/Courses/1516"
                    className="text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="https://placehold.co/300x160/16A085/FFFFFF?text=Database+Design"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title">
                        CS1516 Database Design
                      </CardTitle>
                      <CardText className="wd-dashboard-course-title">
                        Relational database fundamentals
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>

              {/* Course 7 - Mobile Development */}
              <Col className="wd-dashboard-course">
                <Card className="h-100">
                  <Link
                    href="/Courses/1718"
                    className="text-decoration-none text-dark"
                  >
                    <CardImg
                      variant="top"
                      src="https://placehold.co/300x160/34495E/FFFFFF?text=Mobile+Dev"
                      style={{ height: "160px", objectFit: "cover" }}
                    />
                    <CardBody>
                      <CardTitle className="wd-dashboard-course-title">
                        CS1718 Mobile Development
                      </CardTitle>
                      <CardText className="wd-dashboard-course-title">
                        iOS and Android development
                      </CardText>
                      <Button variant="primary">Go</Button>
                    </CardBody>
                  </Link>
                </Card>
              </Col>
            </Row>
          </div>
    </div>
  );
}
