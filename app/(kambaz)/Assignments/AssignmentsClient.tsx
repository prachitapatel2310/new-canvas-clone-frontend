"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store"; // adjust path to your store
import * as client from "../Courses/Assignments/client";
import { ListGroup, Button } from "react-bootstrap";
import { FaPlus, FaTrash, FaPencilAlt } from "react-icons/fa";
import AssignmentEditor from "./AssignmentEditor";
import {
  setAssignments,
  addAssignment,
  updateAssignment as updateAssignmentAction,
  deleteAssignment as deleteAssignmentAction,
} from "./reducer";

export default function AssignmentsClient() {
  const { cid } = useParams() as { cid?: string };
  const dispatch = useDispatch<AppDispatch>();
  const assignments = useSelector((s: RootState) => (s as any).assignmentsReducer?.assignments ?? []);

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  console.log("🔍 AssignmentsClient rendering");
  console.log("📍 Course ID:", cid);
  console.log("📚 Assignments from store:", assignments);

  useEffect(() => {
    const fetch = async () => {
      if (!cid) return;
      try {
        const data = await client.findAssignmentsForCourse(cid);
        dispatch(setAssignments(data));
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, [cid, dispatch]);

  const createAssignment = async () => {
    if (!cid || !title?.trim()) return;
    try {
      const payload = { title: title.trim(), course: cid };
      const created = await client.createAssignmentForCourse(cid, payload);
      dispatch(addAssignment(created));
      setTitle("");
      setShowEditor(false);
    } catch (e) {
      console.error(e);
      alert("Could not create assignment");
    }
  };

  const saveUpdate = async () => {
    if (!editingId) return;
    const existing = assignments.find((a: any) => a._id === editingId);
    if (!existing) return;
    try {
      const updated = { ...existing, title: title.trim() };
      await client.updateAssignment(updated);
      dispatch(updateAssignmentAction(updated));
      setEditingId(null);
      setTitle("");
      setShowEditor(false);
    } catch (e) {
      console.error(e);
      alert("Could not update assignment");
    }
  };

  const removeAssignment = async (aid: string) => {
    if (!confirm("Delete assignment?")) return;
    try {
      await client.deleteAssignment(aid);
      dispatch(deleteAssignmentAction(aid));
    } catch (e) {
      console.error(e);
      alert("Could not delete assignment");
    }
  };

  const startEdit = (a: any) => {
    setEditingId(a._id);
    setTitle(a.title ?? "");
    setShowEditor(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="danger" size="sm" onClick={() => { setEditingId(null); setTitle(""); setShowEditor(true); }}>
          <FaPlus className="me-1" /> Assignment
        </Button>
      </div>

      <ListGroup>
        {(assignments ?? []).map((a: any) => (
          <ListGroup.Item key={a._id} className="d-flex justify-content-between align-items-center">
            <div>{a.title}</div>
            <div className="d-flex gap-2">
              <FaPencilAlt style={{ cursor: "pointer" }} onClick={() => startEdit(a)} />
              <FaTrash style={{ cursor: "pointer", color: "red" }} onClick={() => removeAssignment(a._id)} />
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <AssignmentEditor
        show={showEditor}
        handleClose={() => { setShowEditor(false); setEditingId(null); setTitle(""); }}
        dialogTitle={editingId ? "Edit Assignment" : "Add Assignment"}
        assignmentTitle={title}
        setAssignmentTitle={setTitle}
        saveAssignment={editingId ? saveUpdate : createAssignment}
      />
    </div>
  );
}
