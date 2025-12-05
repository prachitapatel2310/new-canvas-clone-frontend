// app/Courses/[cid]/Quizzes/[qid]/editor/questions/MultipleChoiceEditor.tsx
"use client";

import React, { useState } from "react";
import { Form, Button, Card, ListGroup } from "react-bootstrap";
import { QuizQuestion } from "../../../../Quizzes/reducer";
import { FaTrash, FaPlus } from "react-icons/fa";

interface Props {
  question: QuizQuestion;
  onSave: (q: QuizQuestion) => void;
  onCancel: () => void;
}

export default function MultipleChoiceEditor({ question, onSave, onCancel }: Props) {
  const [qData, setQData] = useState<QuizQuestion>(question);

  const handleAddChoice = () => {
    setQData({
      ...qData,
      choices: [
        ...(qData.choices || []),
        { text: `Choice ${(qData.choices?.length || 0) + 1}`, isCorrect: false },
      ],
    });
  };

  const handleChoiceChange = (index: number, newText: string) => {
    const updatedChoices = qData.choices?.map((choice, i) =>
      i === index ? { ...choice, text: newText } : choice
    );
    setQData({ ...qData, choices: updatedChoices });
  };

  const handleCorrectChange = (index: number) => {
    const updatedChoices = qData.choices?.map((choice, i) => ({
      ...choice,
      isCorrect: i === index,
    }));
    setQData({ ...qData, choices: updatedChoices });
  };

  const handleRemoveChoice = (index: number) => {
    if (qData.choices && qData.choices.length <= 2) {
      alert("Must have at least 2 choices");
      return;
    }
    setQData({
      ...qData,
      choices: qData.choices?.filter((_, i) => i !== index),
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
        />
      </Form.Group>
      
      <Form.Label>Choices</Form.Label>
      <ListGroup className="mb-3">
        {qData.choices?.map((choice, index) => (
          <ListGroup.Item key={index} className="d-flex align-items-center">
            <Form.Check
              type="radio"
              name={`correct-choice-${qData._id}`}
              checked={choice.isCorrect}
              onChange={() => handleCorrectChange(index)}
              className="me-3"
            />
            <Form.Control
              value={choice.text}
              onChange={(e) => handleChoiceChange(index, e.target.value)}
              className="me-2"
            />
            <Button variant="outline-danger" size="sm" onClick={() => handleRemoveChoice(index)}>
              <FaTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      
      <Button variant="secondary" size="sm" onClick={handleAddChoice} className="mb-3">
        <FaPlus className="me-1" /> Add Choice
      </Button>

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(qData)}>Update Question</Button>
      </div>
    </Card>
  );
}