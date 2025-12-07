// app/Courses/[cid]/Quizzes/[qid]/editor/questions/FillBlankEditor.tsx
"use client";

import React, { useState } from "react";
import { Form, Button, Card, ListGroup } from "react-bootstrap";
import { QuizQuestion } from "../../../reducer";
import { FaTrash, FaPlus } from "react-icons/fa";

interface Props {
  question: QuizQuestion;
  onSave: (q: QuizQuestion) => void;
  onCancel: () => void;
}

export default function FillBlankEditor({ question, onSave, onCancel }: Props) {
  const [qData, setQData] = useState<QuizQuestion>(question);
  const [newAnswer, setNewAnswer] = useState("");

  const handleAddAnswer = () => {
    if (newAnswer.trim()) {
      setQData({
        ...qData,
        correctAnswers: [
          ...(qData.correctAnswers || []),
          newAnswer.trim(),
        ],
      });
      setNewAnswer("");
    }
  };

  const handleRemoveAnswer = (index: number) => {
    setQData({
      ...qData,
      correctAnswers: qData.correctAnswers?.filter((_, i) => i !== index),
    });
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
          placeholder="Use underscores ____ to indicate where the blank should be"
        />
      </Form.Group>

      <Form.Label>Possible Correct Answers (Case Insensitive)</Form.Label>
      <ListGroup className="mb-2">
        {qData.correctAnswers?.map((answer, index) => (
          <ListGroup.Item key={index} className="d-flex align-items-center">
            <Form.Control value={answer} readOnly className="me-2" />
            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveAnswer(index)}>
              <FaTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      
      <div className="d-flex gap-2 mb-3">
        <Form.Control
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Add a correct answer"
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAnswer())}
        />
        <Button variant="success" size="sm" onClick={handleAddAnswer}>
          <FaPlus />
        </Button>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(qData)}>Update Question</Button>
      </div>
    </Card>
  );
}