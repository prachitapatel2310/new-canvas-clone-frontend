"use client";

import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { QuizQuestion } from "../../../reducer";

interface Props {
  question: QuizQuestion;
  onSave: (q: QuizQuestion) => void;
  onCancel: () => void;
}

export default function TrueFalseEditor({ question, onSave, onCancel }: Props) {
  // qData.correctAnswer is now expected to be a string: "True", "False", or undefined
  const [qData, setQData] = useState<QuizQuestion>(question);

  const handleSave = () => {
    // Basic validation to ensure an answer has been selected
    if (!qData.correctAnswer || (qData.correctAnswer !== "True" && qData.correctAnswer !== "False")) {
      alert("Please select either True or False as the correct answer before saving.");
      return;
    }
    onSave(qData);
  };

  return (
    <Card className="p-3">
      <Form.Group className="mb-3">
        <Form.Label>Question Title</Form.Label>
        <Form.Control
          value={qData.title}
          onChange={(e) => setQData({ ...qData, title: e.target.value })}
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Points</Form.Label>
        <Form.Control
          type="number"
          value={qData.points}
          onChange={(e) => setQData({ ...qData, points: Number(e.target.value) })}
          min={1}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Question Text</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={qData.questionText}
          onChange={(e) => setQData({ ...qData, questionText: e.target.value })}
        />
      </Form.Group>
      
      <Form.Group className="mb-3">
        <Form.Label>Correct Answer</Form.Label>
        <div className="ms-3">
          <Form.Check
            type="radio"
            label="True"
            name={`tf-correct-${qData._id}`}
            // Check against string literal "True"
            checked={qData.correctAnswer === "True"}
            // Set to string literal "True"
            onChange={() => setQData({ ...qData, correctAnswer: "True" })}
          />
          <Form.Check
            type="radio"
            label="False"
            name={`tf-correct-${qData._id}`}
            // Check against string literal "False"
            checked={qData.correctAnswer === "False"}
            // Set to string literal "False"
            onChange={() => setQData({ ...qData, correctAnswer: "False" })}
          />
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Update Question</Button>
      </div>
    </Card>
  );
}