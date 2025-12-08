// app/(kambaz)/Courses/[cid]/Quizzes/[qid]/take/QuizTake.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Card, Form, ListGroup, Alert, Badge } from "react-bootstrap";
import { Quiz, QuizQuestion } from "../../reducer"; 
import type { RootState } from "../../../../../store";
import * as client from "../../client";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

export default function QuizTake() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();

  const quizzesState = useSelector((state: RootState) => {
    try {
      return (state.quizzesReducer as any)?.quizzes || [];
    } catch (error) {
      console.error("Redux selector error:", error);
      return [];
    }
  });

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
  
  // Check if quiz was already taken
  useEffect(() => {
    if (isStudent && qid && currentUser?._id) {
      const storedScore = localStorage.getItem(`quiz_${qid}_user_${currentUser._id}_score`);
      const storedAnswers = localStorage.getItem(`quiz_${qid}_user_${currentUser._id}_answers`);
      
      if (storedScore !== null && storedAnswers) {
        setScore(Number(storedScore));
        setAnswers(JSON.parse(storedAnswers));
        setSubmitted(true);
      }
    }
  }, [qid, currentUser, isStudent]);

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
            ans => ans.toLowerCase().trim() === String(userAnswer).toLowerCase().trim()
          );
        }
        return false;
      
      default:
        return false;
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitted) return;

    if (timeRemaining && timeRemaining > 0) {
      if (!window.confirm("Are you sure you want to submit your quiz? You cannot change your answers after submission.")) {
        return;
      }
    }

    if (!localQuiz) return;

    // Calculate score locally
    let calculatedScore = 0;
    localQuiz.questions.forEach(q => {
      const studentAnswer = answers[q._id];
      const isCorrect = checkAnswer(q, studentAnswer);
      
      if (isCorrect) {
        calculatedScore += q.points || 0;
      }
    });

    // Save to localStorage
    if (currentUser?._id) {
      localStorage.setItem(`quiz_${qid}_user_${currentUser._id}_score`, String(calculatedScore));
      localStorage.setItem(`quiz_${qid}_user_${currentUser._id}_answers`, JSON.stringify(answers));
      localStorage.setItem(`quiz_${qid}_user_${currentUser._id}_submittedAt`, new Date().toISOString());
    }

    setScore(calculatedScore);
    setSubmitted(true);
    window.scrollTo(0, 0);

  }, [submitted, timeRemaining, localQuiz, answers, qid, currentUser]);

  useEffect(() => {
    if (!isStudent) {
      router.replace(`/Courses/${cid}/Quizzes/${qid}/details`);
      return;
    }
  }, [isStudent, cid, qid, router]);

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
        
        if (!submitted) {
          const initialAnswers: Record<string, any> = {};
          if (fetchedQuiz.questions && Array.isArray(fetchedQuiz.questions)) {
            fetchedQuiz.questions.forEach((q: QuizQuestion) => {
              initialAnswers[q._id] = "";
            });
          }
          setAnswers(initialAnswers);
        }
        
        if (fetchedQuiz.timeLimit && !submitted) {
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

    if (currentQuiz) {
      setLocalQuiz(currentQuiz);
      
      if (!submitted) {
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
      }
      setLoading(false);
    } else {
      fetchQuiz();
    }
  }, [qid, currentQuiz, cid, router, isStudent, submitted]);

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

  if (!localQuiz.questions || localQuiz.questions.length === 0) {
    return (
      <div className="p-4">
        <Alert variant="warning">
          <Alert.Heading>No Questions Available</Alert.Heading>
          <p>This quiz doesn't have any questions yet.</p>
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
            <Badge bg="secondary">{q.points} pts</Badge>
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
                    <strong>Correct Answer:</strong> {String(q.correctAnswer)}
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
                      <strong>Correct Answers:</strong> {q.correctAnswers?.join(', ')}
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

  // ✅ UPDATED: Results view after submission
  if (submitted) {
    const percentage = Math.round((score / localQuiz.points) * 100);
    
    return (
      <div id="wd-quiz-results" className="container mt-4" style={{ maxWidth: "900px" }}>
        <h2 className="text-danger mb-4">{localQuiz.title}</h2>

        <Card className="mb-4 border-success">
          <Card.Body className="text-center">
            <h3 className="text-success mb-3">
              <FaCheckCircle className="me-2" />
              Quiz Submitted Successfully!
            </h3>
            <h2 className="mb-3">
              Score: {score} / {localQuiz.points}
            </h2>
            <div className="progress mb-3" style={{ height: "30px" }}>
              <div 
                className={`progress-bar ${percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
                style={{ width: `${percentage}%` }}
              >
                {percentage}%
              </div>
            </div>
            
            {/* ✅ UPDATED: Navigation buttons */}
            <div className="d-flex gap-3 justify-content-center">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/details`)}
              >
                Back to Quiz Details
              </Button>
              
              <Button 
                variant="outline-secondary" 
                size="lg"
                onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
              >
                All Quizzes
              </Button>
            </div>
          </Card.Body>
        </Card>

        <h4 className="mb-4">Review Your Answers</h4>
        
        {localQuiz.questions.map((q, idx) => (
          <div key={q._id} className="mb-3">
            <h5 className="text-muted">Question {idx + 1}</h5>
            <QuestionRenderer q={q} showResult={true} />
          </div>
        ))}
      </div>
    );
  }

  // Quiz taking view
  return (
    <div id="wd-quiz-take" className="container mt-4" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light border rounded">
        <h2 className="text-danger mb-0">{localQuiz.title}</h2>
        {timeRemaining !== null && (
          <div 
            className={`px-3 py-2 rounded fw-bold ${timeRemaining < 60 ? 'bg-danger text-white' : 'bg-white border'}`}
          >
            <FaClock className="me-2" />
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>

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
              ← Previous
            </Button>

            <span className="badge bg-secondary fs-6">
              Question {currentQuestionIndex + 1} of {localQuiz.questions.length}
            </span>

            {currentQuestionIndex < localQuiz.questions.length - 1 ? (
              <Button 
                variant="primary" 
                onClick={handleNext}
              >
                Next →
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
            <div key={q._id} className="mb-4">
              <h5 className="text-muted">Question {idx + 1}</h5>
              <QuestionRenderer q={q} />
            </div>
          ))}

          <div className="d-flex justify-content-end mt-5 mb-5">
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