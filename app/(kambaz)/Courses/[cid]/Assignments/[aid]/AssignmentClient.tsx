"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Row, Col, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store";
import { addAssignment, updateAssignment } from "../../../Assignments/reducer";

export default function AssignmentEditor() {
  const { cid, aid } = useParams() as { cid?: string; aid?: string };
  const assignmentsFromStore = useSelector((state: RootState) => (state.assignmentsReducer as any).assignments) || [];
  const assignment = assignmentsFromStore.find((a: any) => a._id === aid) ?? null;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const canEdit = currentUser && ["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser.role ?? "").toUpperCase());
  const [title, setTitle] = useState<string>(assignment?.title ?? "");
  const [description, setDescription] = useState<string>(assignment?.description ?? "");
  const [maxPoints, setMaxPoints] = useState<number>(assignment?.maxPoints ?? 100);
  const [due, setDue] = useState<string>(assignment?.due ?? "");
  const [available, setAvailable] = useState<string>(assignment?.available ?? "");
  const [until, setUntil] = useState<string>(assignment?.until ?? "");

  useEffect(() => {
    // redirect users without edit permissions back to the assignments list
    if (!canEdit) {
      router.push(`/Courses/${cid}/Assignments`);
      return;
    }

    if (assignment) {
      setTitle(assignment.title ?? "");
      setDescription(assignment.description ?? "");
      setMaxPoints(assignment.maxPoints ?? 100);
      setDue(assignment.due ?? "");
      setAvailable(assignment.available ?? "");
      setUntil(assignment.until ?? "");
    }
  }, [assignment, canEdit, cid, router]);

  const save = () => {
    if (aid === "new") {
      dispatch(addAssignment({ title, description, maxPoints, due, available, until, course: cid }));
    } else if (aid) {
      // aid can be undefined in the route params typing; guard ensures it's a string here
      const updatedAssignment = { _id: aid, title, description, maxPoints, due, available, until, course: cid };
      dispatch(updateAssignment(updatedAssignment as any));
    } else {
      // Shouldn't happen - if no aid available, just navigate back
      router.push(`/Courses/${cid}/Assignments`);
      return;
    }
    // navigate back
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignment-editor">
      <h1>
        <b>Assignment Editor</b>
      </h1>
      <hr />
      <Row>
        <Col md={12}>
          <Card className="p-3">
            <h3 className="mb-3">{assignment ? assignment.title : "New Assignment"}</h3>

            <Form.Group className="mb-3">
              <Form.Label>Assignment Name</Form.Label>
              <Form.Control value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={4} value={description} onChange={(e) => setDescription((e.target as HTMLTextAreaElement).value)} />
            </Form.Group>

            <Row className="mb-3 align-items-end">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Points</Form.Label>
                  <Form.Control type="number" value={maxPoints} onChange={(e) => setMaxPoints(Number((e.target as HTMLInputElement).value))} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control type="date" value={due} onChange={(e) => setDue((e.target as HTMLInputElement).value)} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Available from</Form.Label>
                  <Form.Control type="date" value={available} onChange={(e) => setAvailable((e.target as HTMLInputElement).value)} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Assign to</Form.Label>
                  <Form.Control placeholder="" />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Card className="p-3">
                  <Form.Group className="mb-2">
                    <Form.Label>Due</Form.Label>
                    <Form.Control type="date" value={due} onChange={(e) => setDue((e.target as HTMLInputElement).value)} />
                  </Form.Group>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Available from</Form.Label>
                        <Form.Control type="date" value={available} onChange={(e) => setAvailable((e.target as HTMLInputElement).value)} />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Until</Form.Label>
                        <Form.Control type="date" value={until} onChange={(e) => setUntil((e.target as HTMLInputElement).value)} />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            <div className="mt-3">
              <Button variant="secondary" className="me-2" onClick={() => { router.push(`/Courses/${cid}/Assignments`); }}>Cancel</Button>
              <Button variant="primary" onClick={save}>Save</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
