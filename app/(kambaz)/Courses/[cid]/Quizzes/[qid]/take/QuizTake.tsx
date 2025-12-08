// app/(kambaz)/Courses/[cid]/Quizzes/[qid]/take/QuizTake.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Card, Form, ListGroup, Alert } from "react-bootstrap";
import { Quiz, QuizQuestion } from "../../reducer"; 
import type { RootState } from "../../../../../store";
import * as client from "../../client";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

export default function QuizTake() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();

  // ✅ FIX: Better Redux selector with error handling
  const quizzesState = useSelector((state: RootState) => {
    try {
      return (state.quizzesReducer as any)?.quizzes || [];
    } catch (error) {
      console.error("Redux selector error:", error);
      return [];
    }
  });

  // ✅ FIX: Safely filter and find quiz
  const quizzes: Quiz[] = Array.isArray(quizzesState) 
    ? quizzesState.filter((q: any) => q && typeof q === 'object' && q._id)
    : [];
  
  const currentQuiz: Quiz | undefined = quizzes.find((q) => q._id === qid);
  
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [loading, setLoading] = useState(true);
  const [localQuiz, setLocalQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const isStudent = !["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser?.role ?? "").toUpperCase());
  
  // Function for checking answer locally
  const checkAnswer = (question: QuizQuestion, userAnswer: any): boolean => {
    if (!userAnswer && userAnswer !== false) return false;

    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
        return question.correctAnswer === userAnswer;
      
      case 'TRUE_FALSE':
        return String(question.correctAnswer).toLowerCase() === String(userAnswer).toLowerCase();
      
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

  // ✅ FIX: Use useCallback to prevent infinite loops
  const handleSubmit = useCallback(async () => {
    if (submitted) return;

    if (timeRemaining && timeRemaining > 0) {
      if (!window.confirm("Are you sure you want to submit your quiz? You cannot change your answers after submission.")) {
        return;
      }
    }

    if (!localQuiz) return;

    const submissionAnswers = localQuiz.questions.map(question => ({
      question: question._id,
      studentAnswer: answers[question._id] ?? "" 
    }));

    try {
      setSubmitted(true); 
      
      const newSubmission = await client.submitQuiz(qid, { answers: submissionAnswers }); 
      setScore(newSubmission.score); 

    } catch (error: any) {
      console.error("Error submitting quiz attempt:", error);
      setSubmitted(false); 
      const errorMessage = error?.response?.data?.message || "Internal Server Error while submitting quiz.";
      alert(`Submission failed: ${errorMessage}`);
    }
  }, [submitted, timeRemaining, localQuiz, answers, qid]);

  // Redirect faculty to details page
  useEffect(() => {
    if (!isStudent) {
      router.replace(`/Courses/${cid}/Quizzes/${qid}/details`);
      return;
    }
  }, [isStudent, cid, qid, router]);

  // ✅ FIX: Improved fetch logic
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid || !isStudent) return;
      
      setLoading(true);
      
      try {
        const fetchedQuiz = await client.findQuizById(qid);
        
        if (!fetchedQuiz) {
          throw new Error("Quiz not found");
        }

        setLocalQuiz(fetchedQuiz);
        
        // Initialize empty answers
        const initialAnswers: Record<string, any> = {};
        if (fetchedQuiz.questions && Array.isArray(fetchedQuiz.questions)) {
          fetchedQuiz.questions.forEach((q: QuizQuestion) => {
            initialAnswers[q._id] = "";
          });
        }
        setAnswers(initialAnswers);
        
        // Initialize timer
        if (fetchedQuiz.timeLimit) {
          setTimeRemaining(fetchedQuiz.timeLimit * 60);
        }
      } catch (error: any) {
        console.error("Error fetching quiz:", error);
        alert(`Failed to load quiz: ${error.message || "Unknown error"}`);
        router.push(`/Courses/${cid}/Quizzes`);
      } finally {
        setLoading(false);
      }
    };

    // Try Redux first, then fetch
    if (currentQuiz) {
      setLocalQuiz(currentQuiz);
      
      // Initialize answers for Redux quiz
      const initialAnswers: Record<string, any> = {};
      if (currentQuiz.questions && Array.isArray(currentQuiz.questions)) {
        currentQuiz.questions.forEach((q: QuizQuestion) => {
          initialAnswers[q._id] = "";
        });
      }
      setAnswers(initialAnswers);
      
      if (currentQuiz.timeLimit) {
        setTimeRemaining(currentQuiz.timeLimit * 60);
      }
      setLoading(false);
    } else {
      fetchQuiz();
    }
  }, [qid, currentQuiz, cid, router, isStudent]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, submitted, handleSubmit]);

  const handleAnswerChange = (questionId: string, value: any) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (localQuiz && currentQuestionIndex < localQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Loading state
  if (loading || !localQuiz) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading quiz...</p>
      </div>
    );
  }

  // ✅ FIX: Add safety check for questions
  if (!localQuiz.questions || localQuiz.questions.length === 0) {
    return (
      <div className="p-4">
        <Alert variant="warning">
          <Alert.Heading>No Questions Available</Alert.Heading>
          <p>This quiz doesnt have any questions yet.</p>
          <Button onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Back to Quizzes
          </Button>
        </Alert>
      </div>
    );
  }

  const currentQuestion = localQuiz.questions[currentQuestionIndex];
  const showOneAtATime = localQuiz.oneQuestionAtATime;

  const QuestionRenderer = ({ q, showResult = false }: { q: QuizQuestion; showResult?: boolean }) => {
    const userAnswer = answers[q._id];
    const isCorrect = showResult && checkAnswer(q, userAnswer);
    const questionType = q.questionType;

    const shouldShowCorrectAnswer = showResult && (
      localQuiz.showCorrectAnswers === "IMMEDIATELY" || 
      (localQuiz.showCorrectAnswers === "AFTER_LAST_ATTEMPT" && submitted)
    );

    return (
      <Card className={`mb-4 ${showResult ? (isCorrect ? 'border-success' : 'border-danger') : ''}`}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>{q.title}</h5>
          <div className="d-flex align-items-center">
            {showResult && (
              isCorrect 
                ? <FaCheckCircle className="text-success me-2" /> 
                : <FaTimesCircle className="text-danger me-2" />
            )}
            <small className="text-muted">({q.points} pts)</small>
          </div>
        </Card.Header>
        <Card.Body>
          <div dangerouslySetInnerHTML={{ __html: q.questionText }} />
          <Form className="mt-3">
            {questionType === 'MULTIPLE_CHOICE' && q.choices && (
              <div>
                {q.choices.map((choiceText, idx) => {
                  const isCorrectChoice = showResult && choiceText === q.correctAnswer;
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
                      className={shouldShowCorrectAnswer && isCorrectChoice ? 'text-success fw-bold' : ''}
                    />
                  );
                })}
              </div>
            )}

            {questionType === 'TRUE_FALSE' && (
              <div>
                {["True", "False"].map((value, idx) => {
                  const valueString = value.toLowerCase();
                  const isCorrectOption = showResult && String(q.correctAnswer).toLowerCase() === valueString;
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
                      className={shouldShowCorrectAnswer && isCorrectOption ? 'text-success fw-bold' : ''}
                    />
                  );
                })}

                {showResult && shouldShowCorrectAnswer && (
                  <p className="text-success mt-2">
                    Correct Answer: {String(q.correctAnswer)}
                  </p>
                )}
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
                {showResult && shouldShowCorrectAnswer && (
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

  // Results view after submission
  if (submitted) {
    return (
      <div id="wd-quiz-results" className="container mt-4">
        <h2 className="text-danger">{localQuiz.title}</h2>
        <hr />

        <Alert variant="success">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0">Quiz Submitted Successfully!</h4>
              <p className="mb-0 mt-2">
                Your score: {score} / {localQuiz.points} ({Math.round((score / localQuiz.points) * 100)}%)
              </p>
            </div>
            <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
              Back to Quizzes
            </Button>
          </div>
        </Alert>

        <h4 className="mt-4 mb-3">Review Your Answers:</h4>
        
        {localQuiz.questions.map((q, idx) => (
          <div key={q._id}>
            <h5>Question {idx + 1}</h5>
            <QuestionRenderer q={q} showResult={true} />
          </div>
        ))}
      </div>
    );
  }

  // Quiz taking view
  return (
    <div id="wd-quiz-take" className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-danger">{localQuiz.title}</h2>
        {timeRemaining !== null && (
          <Alert variant={timeRemaining < 60 ? "danger" : "info"} className="mb-0 py-2">
            <FaClock className="me-2" />
            Time Remaining: {formatTime(timeRemaining)}
          </Alert>
        )}
      </div>
      <hr />

      <ListGroup className="mb-4">
        <ListGroup.Item>
          <strong>Questions:</strong> {localQuiz.questions.length}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Total Points:</strong> {localQuiz.points}
        </ListGroup.Item>
        <ListGroup.Item>
          <strong>Attempts Allowed:</strong> {localQuiz.howManyAttempts || 1}
        </ListGroup.Item>
      </ListGroup>

      {showOneAtATime ? (
        <>
          <QuestionRenderer q={currentQuestion} />
          
          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button 
              variant="secondary" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>

            <span className="text-muted">
              Question {currentQuestionIndex + 1} of {localQuiz.questions.length}
            </span>

            {currentQuestionIndex < localQuiz.questions.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="success" 
                size="lg" 
                onClick={handleSubmit}
              >
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {localQuiz.questions.map((q, idx) => (
            <div key={q._id}>
              <h5>Question {idx + 1}</h5>
              <QuestionRenderer q={q} />
            </div>
          ))}

          <div className="d-flex justify-content-end mt-4">
            <Button 
              variant="success" 
              size="lg" 
              onClick={handleSubmit}
            >
              Submit Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}