"use client";

import React, { useState, useMemo } from "react";
import { Form, Button, Card, ListGroup } from "react-bootstrap";
import { QuizQuestion } from "../../../reducer";
import { FaTrash, FaPlus } from "react-icons/fa";

interface Props {
  question: QuizQuestion;
  onSave: (q: QuizQuestion) => void;
  onCancel: () => void;
}

// Helper to convert the simple schema (string array + single correct string) 
// to a format easier for the UI to manage (object array)
const schemaToEditorFormat = (q: QuizQuestion) => {
  const choices = q.choices || [];
  const correctAnswer = q.correctAnswer || "";

  return choices.map(text => ({
    text: text,
    isCorrect: text === correctAnswer
  }));
};

// Helper to convert the editor format back to the simple schema
const editorToSchemaFormat = (qData: QuizQuestion, editorChoices: { text: string; isCorrect: boolean }[]) => {
  const choices = editorChoices.map(c => c.text);
  const correctAnswer = editorChoices.find(c => c.isCorrect)?.text || "";

  return {
    ...qData,
    choices: choices,
    correctAnswer: correctAnswer,
  };
};


export default function MultipleChoiceEditor({ question, onSave, onCancel }: Props) {
  // Use the canonical question structure for saving
  const [qData, setQData] = useState<QuizQuestion>(question);
  
  // Use a local state derived from qData for complex list editing in the UI
  const [editorChoices, setEditorChoices] = useState(() => schemaToEditorFormat(question));


  const handleAddChoice = () => {
    setEditorChoices([
      ...editorChoices,
      { text: `Choice ${(editorChoices.length || 0) + 1}`, isCorrect: false },
    ]);
  };

  const handleChoiceChange = (index: number, newText: string) => {
    const updatedChoices = editorChoices.map((choice, i) =>
      i === index ? { ...choice, text: newText } : choice
    );
    setEditorChoices(updatedChoices);
  };

  const handleCorrectChange = (index: number) => {
    // Only set one choice as correct
    const updatedChoices = editorChoices.map((choice, i) => ({
      ...choice,
      isCorrect: i === index,
    }));
    setEditorChoices(updatedChoices);
  };

  const handleRemoveChoice = (index: number) => {
    if (editorChoices.length <= 2) {
      alert("Multiple Choice questions must have at least 2 choices.");
      return;
    }
    setEditorChoices(editorChoices.filter((_, i) => i !== index));
  };
  
  const handleSave = () => {
    // Convert the editor state back to the schema format before saving
    const savedQuestion = editorToSchemaFormat(qData, editorChoices);
    
    // Perform minimal validation: ensure at least one correct answer is selected
    if (!savedQuestion.correctAnswer) {
      alert("Please select a correct answer before saving.");
      return;
    }
    
    onSave(savedQuestion);
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
          // Ensure points update is reflected in the canonical state (qData)
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
          // Ensure question text update is reflected in the canonical state (qData)
          onChange={(e) => setQData({ ...qData, questionText: e.target.value })}
        />
      </Form.Group>
      
      <Form.Label>Choices</Form.Label>
      <ListGroup className="mb-3">
        {editorChoices.map((choice, index) => (
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
        <Button variant="primary" onClick={handleSave}>Update Question</Button>
      </div>
    </Card>
  );
}