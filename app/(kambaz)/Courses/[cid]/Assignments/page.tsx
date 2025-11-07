"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import * as db from "../../../Database";
import { ListGroup, ListGroupItem, Button, Row, Col, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/lib/redux/store";
import { deleteAssignment } from "../../Assignments/reducer";

  // get current user to enforce role-based UI
  

export default function AssignmentsPage() {
  const { cid } = useParams() as { cid?: string };
  const assignments = useSelector((state: RootState) => (state.assignmentsReducer as any).assignments) || [];
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const canEdit = currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser.role ?? "").toUpperCase());

  const courseAssignments = assignments
    .filter((a: any) => a.course === cid)
    .filter((a: any) => a.title.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div id="wd-assignments-page">
      <h1><b>Course {cid}</b></h1>
      <hr />
      <Row>
        {/* removed left navigation column (navigation is provided by the layout) */}
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
                      <Link href={`/Courses/${cid}/Assignments/${a._id}`} className="wd-assignment-link h5 text-decoration-none">
                        {a.title}
                      </Link>
                      <div className="text-muted mt-1">
                        Multiple Modules | <b>Due</b> {a.due} | <b>Points</b> {a.maxPoints}
                      </div>
                    </div>
                    <div>
                      {canEdit && (
                        <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => {
                          if (confirm('Are you sure you want to delete this assignment?')) {
                            dispatch(deleteAssignment(a._id));
                          }
                        }} id={`wd-delete-assignment-${a._id}`}>
                          Delete
                        </Button>
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
