"use client";

import { Modal, Button, FormControl } from "react-bootstrap";
import React from "react";

export default function AssignmentEditor({
  show,
  handleClose,
  dialogTitle,
  assignmentTitle,
  setAssignmentTitle,
  saveAssignment,
}: any) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{dialogTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl
          value={assignmentTitle}
          onChange={(e) => setAssignmentTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveAssignment();
            }
          }}
          placeholder="Assignment title"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={saveAssignment}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
