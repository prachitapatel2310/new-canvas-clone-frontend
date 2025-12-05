// app/Courses/[cid]/Quizzes/[qid]/preview/QuizPreview.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Card, Form, ListGroup } from "react-bootstrap";
import { Quiz, QuizQuestion } from "../../../Quizzes/reducer";
import type { RootState } from "../../../../../store";
import * as client from "../../..//Quizzes/client";
import { FaPencilAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function QuizPreview() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();

  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const currentQuiz: Quiz | undefined = quizzes.find((q) => q._id === qid);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [loading, setLoading] = useState(true);
  const [localQuiz, setLocalQuiz] = useState<Quiz | null>(currentQuiz || null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const isFaculty = ["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser?.role ?? "").toUpperCase());
  
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid) return;
      try {
        const fetchedQuiz = await client.findQuizById(qid);
        setLocalQuiz(fetchedQuiz);
      } catch (error) {
        console.error("Error fetching quiz for preview:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentQuiz) {
      setLocalQuiz(currentQuiz);
      setLoading(false);
    } else {
      fetchQuiz();
    }
  }, [qid, currentQuiz]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const checkAnswer = (question: QuizQuestion, userAnswer: any): boolean => {
    if (!userAnswer && userAnswer !== false) return false;

    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        const correctChoice = question.choices?.find(c => c.isCorrect);
        return correctChoice?.text === userAnswer;
      
      case 'TRUE_FALSE':
        return String(question.correctAnswer) === String(userAnswer);
      
      case 'FILL_IN_THE_BLANK':
        if (Array.isArray(question.correctAnswers)) {
          return question.correctAnswers.some(
            ans => ans.toLowerCase() === String(userAnswer).toLowerCase()
          );
        }
        return false;
      
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!localQuiz) return;

    let calculatedScore = 0;
    localQuiz.questions.forEach(question => {
      const userAnswer = answers[question._id];
      if (checkAnswer(question, userAnswer)) {
        calculatedScore += question.points;
      }
    });

    setScore(calculatedScore);
    setSubmitted(true);
  };
  
  if (loading || !localQuiz) {
    return <div className="p-4">Loading quiz preview...</div>;
  }

  const QuestionRenderer = ({ q }: { q: QuizQuestion }) => {
    const userAnswer = answers[q._id];
    const isCorrect = submitted && checkAnswer(q, userAnswer);
    const isIncorrect = submitted && !isCorrect;

    return (
      <Card className={`mb-4 ${submitted ? (isCorrect ? 'border-success' : 'border-danger') : ''}`}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>{q.title}</h5>
          <div className="d-flex align-items-center">
            {submitted && (
              isCorrect 
                ? <FaCheckCircle className="text-success me-2" /> 
                : <FaTimesCircle className="text-danger me-2" />
            )}
            <small className="text-muted">({q.points} pts)</small>
          </div>
        </Card.Header>
        <Card.Body>
          <p>{q.questionText}</p>
          <Form>
            {q.type === 'MULTIPLE_CHOICE' && q.choices && (
              <div>
                {q.choices.map((choice, idx) => (
                  <Form.Check 
                    key={idx}
                    type="radio" 
                    label={choice.text} 
                    name={`q-${q._id}`} 
                    value={choice.text}
                    checked={userAnswer === choice.text}
                    onChange={() => handleAnswerChange(q._id, choice.text)}
                    disabled={submitted}
                    className={submitted && choice.isCorrect ? 'text-success fw-bold' : ''}
                  />
                ))}
              </div>
            )}

            {q.type === 'TRUE_FALSE' && (
              <div>
                <Form.Check 
                  type="radio" 
                  label="True" 
                  name={`q-${q._id}`} 
                  value="true" 
                  checked={userAnswer === "true"}
                  onChange={() => handleAnswerChange(q._id, "true")}
                  disabled={submitted}
                />
                <Form.Check 
                  type="radio" 
                  label="False" 
                  name={`q-${q._id}`} 
                  value="false" 
                  checked={userAnswer === "false"}
                  onChange={() => handleAnswerChange(q._id, "false")}
                  disabled={submitted}
                />
                {submitted && (
                  <p className="text-success mt-2">
                    Correct Answer: {String(q.correctAnswer)}
                  </p>
                )}
              </div>
            )}

            {q.type === 'FILL_IN_THE_BLANK' && (
              <div>
                <Form.Control 
                  type="text"
                  value={userAnswer || ''}
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  disabled={submitted}
                  placeholder="Type your answer here"
                />
                {submitted && (
                  <div className="mt-2">
                    <p className="text-success mb-0">
                      Correct Answers: {q.correctAnswers?.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div id="wd-quiz-preview">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-danger">{localQuiz.title}</h2>
        {isFaculty && (
          <Button 
            variant="primary" 
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor/questions`)}
          >
            <FaPencilAlt className="me-1" /> Edit Quiz
          </Button>
        )}
      </div>
      <hr />

      <div className="alert alert-info">
        <strong>Preview Mode:</strong> This is a preview. {isFaculty ? "Your answers will not be saved." : "Complete the quiz to submit your answers."}
      </div>
      
      {submitted && (
        <div className="alert alert-success">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Quiz Submitted!</h4>
            <h4 className="mb-0">Score: {score} / {localQuiz.points}</h4>
          </div>
          <p className="mb-0 mt-2">
            Percentage: {Math.round((score / localQuiz.points) * 100)}%
          </p>
        </div>
      )}
      
      <ListGroup className="mb-4">
        <ListGroup.Item>
          <strong>Time Limit:</strong> {localQuiz.timeLimit} Minutes
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Attempts Allowed:</strong> {localQuiz.attemptsAllowed}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Questions:</strong> {localQuiz.questions.length}
        </ListGroup.Item>
      </ListGroup>

      {localQuiz.questions.map((q) => (
        <QuestionRenderer key={q._id} q={q} />
      ))}

      <div className="d-flex justify-content-between mt-4">
        <Button 
          variant="secondary" 
          onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/details`)}
        >
          Back to Details
        </Button>
        <Button 
          variant="danger" 
          size="lg" 
          onClick={handleSubmit} 
          disabled={submitted}
        >
          {submitted ? "Quiz Submitted" : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}