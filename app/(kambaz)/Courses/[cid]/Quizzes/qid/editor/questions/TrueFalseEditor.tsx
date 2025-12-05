// app/Courses/[cid]/Quizzes/[qid]/editor/questions/TrueFalseEditor.tsx
"use client";

import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { QuizQuestion } from "../../../../Quizzes/reducer";

interface Props {
  question: QuizQuestion;
  onSave: (q: QuizQuestion) => void;
  onCancel: () => void;
}

export default function TrueFalseEditor({ question, onSave, onCancel }: Props) {
  const [qData, setQData] = useState<QuizQuestion>(question);

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
            checked={qData.correctAnswer === true}
            onChange={() => setQData({ ...qData, correctAnswer: true })}
          />
          <Form.Check
            type="radio"
            label="False"
            name={`tf-correct-${qData._id}`}
            checked={qData.correctAnswer === false}
            onChange={() => setQData({ ...qData, correctAnswer: false })}
          />
        </div>
      </Form.Group>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(qData)}>Update Question</Button>
      </div>
    </Card>
  );
}