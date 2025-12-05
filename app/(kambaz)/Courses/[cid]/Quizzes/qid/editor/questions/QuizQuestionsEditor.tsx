// app/Courses/[cid]/Quizzes/[qid]/editor/questions/QuizQuestionsEditor.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dropdown, ListGroup } from "react-bootstrap";
import { Quiz, QuizQuestion, QuestionType, updateQuiz as updateQuizInReducer } from "../../../../Quizzes/reducer";
import type { RootState } from "../../../../../../store";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";
import { BsGripVertical } from "react-icons/bs";
import MultipleChoiceEditor from "./MultipleChoiceEditor";
import TrueFalseEditor from "./TrueFalseEditor";
import FillBlankEditor from "./FillBlankEditor";
import { v4 as uuidv4 } from "uuid";
import * as client from "../../../../Quizzes/client";
import { useQuizEditor } from "../QuizEditorContext";

const defaultQuestionFactory = (type: QuestionType): QuizQuestion => ({
  _id: uuidv4(),
  title: `New ${type.replace(/_/g, ' ')} Question`,
  // --- UPDATED: Use schema name `questionType` ---
  questionType: type, 
  points: 10,
  questionText: "",
  // --- UPDATED: Use schema structure (string array for choices, string for answer) ---
  choices: type === 'MULTIPLE_CHOICE' ? [
    "Choice 1 (Correct)", 
    "Choice 2",
    "Choice 3",
  ] : undefined,
  // Single string for correct answer (either the choice text or "True"/"False")
  correctAnswer: type === 'MULTIPLE_CHOICE' ? "Choice 1 (Correct)" : 
                 (type === 'TRUE_FALSE' ? "True" : undefined),
  correctAnswers: type === 'FILL_IN_THE_BLANK' ? ["answer"] : undefined,
  // --- END UPDATED ---
});

export default function QuizQuestionsEditor() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const dispatch = useDispatch();
  const { setSaveHandler } = useQuizEditor();
  
  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const currentQuiz: Quiz | undefined = quizzes.find((q) => q._id === qid);
  
  const [questions, setQuestions] = useState<QuizQuestion[]>(currentQuiz?.questions || []);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizAndSetQuestions = async () => {
      if (!qid) return;
      try {
        const fetchedQuiz = await client.findQuizById(qid);
        setQuestions(fetchedQuiz.questions || []);
        dispatch(updateQuizInReducer(fetchedQuiz)); 
      } catch (error) {
        console.error("Error fetching quiz for question editor:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentQuiz) {
      setQuestions(currentQuiz.questions || []);
      setLoading(false);
    } else {
      fetchQuizAndSetQuestions();
    }
  }, [qid, currentQuiz, dispatch]);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleAddQuestion = (type: QuestionType) => {
    const newQuestion = defaultQuestionFactory(type);
    setQuestions([...questions, newQuestion]);
    setEditingQuestionId(newQuestion._id);
  };

  const handleSaveQuestion = (updatedQuestion: QuizQuestion) => {
    setQuestions(questions.map(q => 
      q._id === updatedQuestion._id ? updatedQuestion : q
    ));
    setEditingQuestionId(null);
  };

  const handleCancelEdit = () => {
    // If the question is new (not saved yet), remove it
    const editingQuestion = questions.find(q => q._id === editingQuestionId);
    if (editingQuestion && !editingQuestion.questionText) {
      setQuestions(questions.filter(q => q._id !== editingQuestionId));
    }
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter(q => q._id !== questionId));
    }
  };

  // Register save handler with context
  useEffect(() => {
    const handleSaveAllQuestions = async (publish: boolean = false): Promise<Quiz | null> => {
      if (editingQuestionId) {
        alert("Please save or cancel the currently editing question first.");
        return null;
      }
      
      const updatedQuiz: Quiz = {
        ...(currentQuiz as Quiz),
        questions: questions,
        points: questions.reduce((sum, q) => sum + q.points, 0),
        numQuestions: questions.length,
        // --- UPDATED: Use schema name `isPublished` ---
        isPublished: publish,
        // --- END UPDATED ---
      } as Quiz;
      
      try {
        const savedQuiz = await client.updateQuiz(updatedQuiz);
        setQuestions(savedQuiz.questions);
        return savedQuiz;
      } catch (error) {
        console.error("Error saving questions:", error);
        alert("Failed to save questions.");
        return null;
      }
    };

    setSaveHandler(handleSaveAllQuestions);
  }, [questions, editingQuestionId, currentQuiz, setSaveHandler]);

  if (loading) return <p>Loading questions editor...</p>;

  const renderQuestionEditor = (q: QuizQuestion) => {
    const isEditing = q._id === editingQuestionId;
    
    if (!isEditing) {
      return (
        <div className="p-3">
          {/* --- UPDATED: Use schema name `questionType` --- */}
          <p><strong>Type:</strong> {q.questionType.replace(/_/g, ' ')}</p>
          <p><strong>Question:</strong> {q.questionText || <em>No question text</em>}</p>
          {q.questionType === 'MULTIPLE_CHOICE' && (
            <div>
              <strong>Choices:</strong>
              <ul>
                {/* --- UPDATED: Read choices from the string array and compare with correctAnswer string --- */}
                {q.choices?.map((c, i) => (
                  <li 
                    key={i} 
                    className={q.correctAnswer === c ? 'text-success' : ''}
                  >
                    {c} {q.correctAnswer === c && '✓'}
                  </li>
                ))}
                {/* --- END UPDATED --- */}
              </ul>
              <p className="mt-2">
                <strong>Correct Choice:</strong> {q.correctAnswer || <em>None set</em>}
              </p>
            </div>
          )}
          {q.questionType === 'TRUE_FALSE' && (
            // The correct answer is stored as a string ("True" or "False")
            <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
          )}
          {q.questionType === 'FILL_IN_THE_BLANK' && (
            <p><strong>Correct Answers:</strong> {q.correctAnswers?.join(', ')}</p>
          )}
        </div>
      );
    }

    const EditorComponent = 
      // --- UPDATED: Use schema name `questionType` ---
      q.questionType === 'MULTIPLE_CHOICE' ? MultipleChoiceEditor :
      q.questionType === 'TRUE_FALSE' ? TrueFalseEditor :
      q.questionType === 'FILL_IN_THE_BLANK' ? FillBlankEditor : null;
      // --- END UPDATED ---

    if (!EditorComponent) return <p>Unknown question type</p>;

    return (
      <div className="p-3">
        <EditorComponent
          question={q}
          onSave={handleSaveQuestion}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  };

  return (
    <div id="wd-quiz-questions-editor">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Total Points: {totalPoints}</h5>
        <Dropdown>
          <Dropdown.Toggle variant="danger" id="dropdown-basic">
            <FaPlus className="me-1" /> New Question
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleAddQuestion("MULTIPLE_CHOICE")}>
              Multiple Choice
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleAddQuestion("TRUE_FALSE")}>
              True/False
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleAddQuestion("FILL_IN_THE_BLANK")}>
              Fill in the Blank
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <ListGroup className="mt-3">
        {questions.map((q, index) => {
          const isEditing = q._id === editingQuestionId;

          return (
            <ListGroup.Item key={q._id} className="p-0 mb-3 border">
              <div className="p-3 d-flex justify-content-between align-items-center bg-light">
                <div className="d-flex align-items-center">
                  <BsGripVertical className="me-3 text-muted" />
                  <strong>Question {index + 1}: {q.title}</strong>
                  <small className="ms-3 text-muted">({q.points} pts)</small>
                </div>
                <div className="d-flex gap-2">
                  {!isEditing && (
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => setEditingQuestionId(q._id)}
                    >
                      <FaPencilAlt />
                    </Button>
                  )}
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    onClick={() => handleDeleteQuestion(q._id)}
                    disabled={isEditing}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
              
              {renderQuestionEditor(q)}
            </ListGroup.Item>
          );
        })}
      </ListGroup>

      {questions.length === 0 && (
        <div className="alert alert-info text-center">
          Click new question to add a question to this quiz.
        </div>
      )}
    </div>
  );
}