"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Card, Form, ListGroup } from "react-bootstrap";
import { Quiz, QuizQuestion } from "../../reducer";
import type { RootState } from "../../../../../store";
import * as client from "../../client";
import { FaPencilAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getAvailability } from "../../quiz.utils";

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

  /**
   * Checks if the user's answer is correct based on the new schema structure.
   */
  const checkAnswer = (question: QuizQuestion, userAnswer: any): boolean => {
    if (!userAnswer && userAnswer !== false) return false;

    // NOTE: Use question.questionType
    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        // The correct answer is now a single string matching one of the choices
        return question.correctAnswer === userAnswer;
      
      case 'TRUE_FALSE':
        // Both question.correctAnswer (string: "True"/"False") and userAnswer (string: "true"/"false") must be converted to match
        return String(question.correctAnswer).toLowerCase() === String(userAnswer).toLowerCase();
      
      case 'FILL_IN_THE_BLANK':
        if (Array.isArray(question.correctAnswers)) {
          // Check if the user's answer matches any correct answer (case-insensitive)
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

  // Use schema-aligned fields for availability check
  const availability = getAvailability(localQuiz.availableDate, localQuiz.untilDate);
  const isAvailable = localQuiz.isPublished && availability.status === 'Available';


  const QuestionRenderer = ({ q }: { q: QuizQuestion }) => {
    const userAnswer = answers[q._id];
    const isCorrect = submitted && checkAnswer(q, userAnswer);
    // const isIncorrect = submitted && !isCorrect;

    // NOTE: Use q.questionType
    const questionType = q.questionType; 
    
    // Determine correct/incorrect styling
    const cardClassName = submitted 
        ? (isCorrect ? 'border-success' : 'border-danger') 
        : '';
        
    const correctFeedback = submitted && (
      <div className="d-flex align-items-center mt-2">
        {isCorrect 
          ? <FaCheckCircle className="text-success me-2" title="Correct" /> 
          : <FaTimesCircle className="text-danger me-2" title="Incorrect" />
        }
        {isFaculty && (
          // Show correct answer only if submitted (for faculty review)
          <p className="text-success mb-0 ms-2 fw-bold">
            {questionType === 'MULTIPLE_CHOICE' && `Correct: ${q.correctAnswer}`}
            {questionType === 'TRUE_FALSE' && `Correct: ${q.correctAnswer}`}
            {questionType === 'FILL_IN_THE_BLANK' && `Correct: ${q.correctAnswers?.join(' / ')}`}
          </p>
        )}
      </div>
    );

    return (
      <Card className={`mb-4 ${cardClassName}`}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>{q.title}</h5>
          <div className="d-flex align-items-center">
            <small className="text-muted">({q.points} pts)</small>
          </div>
        </Card.Header>
        <Card.Body>
          <p>{q.questionText}</p>
          <Form>
            {/* NOTE: Use q.questionType */}
            {questionType === 'MULTIPLE_CHOICE' && q.choices && (
              <div>
                {/* q.choices is now a string array */}
                {q.choices.map((choiceText, idx) => {
                  const isCorrectChoice = submitted && choiceText === q.correctAnswer;
                  return (
                    <Form.Check 
                      key={idx}
                      type="radio" 
                      label={choiceText} 
                      name={`q-${q._id}`} 
                      value={choiceText}
                      checked={userAnswer === choiceText}
                      onChange={() => handleAnswerChange(q._id, choiceText)}
                      disabled={submitted}
                      // Highlight the correct answer if submitted (for faculty review)
                      className={isCorrectChoice ? 'text-success' : ''}
                    />
                  );
                })}
              </div>
            )}

            {questionType === 'TRUE_FALSE' && (
              <div>
                {/* q.correctAnswer is a string: "True" or "False" */}
                {["True", "False"].map((value, idx) => {
                  const isCorrectOption = submitted && q.correctAnswer === value;
                  const valueString = value.toLowerCase();
                  return (
                    <Form.Check 
                      key={idx}
                      type="radio" 
                      label={value} 
                      name={`q-${q._id}`} 
                      value={valueString} 
                      checked={userAnswer === valueString}
                      onChange={() => handleAnswerChange(q._id, valueString)}
                      disabled={submitted}
                      className={isCorrectOption ? 'text-success' : ''}
                    />
                  );
                })}
              </div>
            )}

            {questionType === 'FILL_IN_THE_BLANK' && (
              <div>
                <Form.Control 
                  type="text"
                  value={userAnswer || ''}
                  onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                  disabled={submitted}
                  placeholder="Type your answer here"
                />
              </div>
            )}
            {correctFeedback}
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
          {/* NOTE: Use schema-aligned field name `howManyAttempts` */}
          <strong>Attempts Allowed:</strong> {localQuiz.howManyAttempts}
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
          disabled={submitted || !isAvailable}
        >
          {submitted ? "Quiz Submitted" : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}