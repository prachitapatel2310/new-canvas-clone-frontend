// app/(kambaz)/Courses/[cid]/Quizzes/[qid]/details/QuizDetailsScreen.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Card, ListGroup, Alert, Badge } from "react-bootstrap";
import { Quiz } from "../../reducer";
import type { RootState } from "../../../../../store";
import * as client from "../../client";
import { FaClock, FaEdit, FaCheckCircle, FaPlay, FaRedo } from "react-icons/fa";

export default function QuizDetailsScreen() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  
  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const currentQuiz = quizzes.find((q) => q._id === qid);

  const [quiz, setQuiz] = useState<Quiz | null>(currentQuiz || null);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState<number | null>(null);

  const isFaculty = ["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser?.role ?? "").toUpperCase());
  const isStudent = !isFaculty;

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const fetchedQuiz = await client.findQuizById(qid);
        setQuiz(fetchedQuiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentQuiz) {
      setQuiz(currentQuiz);
      setLoading(false);
    } else {
      fetchQuiz();
    }
  }, [qid, currentQuiz]);

  // ✅ Load student score from localStorage
  useEffect(() => {
    if (isStudent && currentUser?._id && qid) {
      const storedScore = localStorage.getItem(`quiz_${qid}_user_${currentUser._id}_score`);
      setUserScore(storedScore !== null ? Number(storedScore) : null);
    }
  }, [isStudent, currentUser, qid]);

  const formatDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return "No date set";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading || !quiz) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading quiz details...</p>
      </div>
    );
  }

  // Check availability
  const now = new Date();
  const availableDate = quiz.availableDate ? new Date(quiz.availableDate) : null;
  const untilDate = quiz.untilDate ? new Date(quiz.untilDate) : null;
  
  const isAvailable = (!availableDate || now >= availableDate) && (!untilDate || now <= untilDate);
  const canTakeQuiz = isStudent && quiz.isPublished && isAvailable;
  const hasAttempt = userScore !== null && userScore !== undefined;
  const percentage = hasAttempt && quiz.points > 0 ? Math.round((userScore / quiz.points) * 100) : 0;

  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <Card>
        <Card.Header className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="text-danger mb-0">{quiz.title}</h2>
            {isFaculty && (
              <Button 
                variant="primary"
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor/details`)}
              >
                <FaEdit className="me-2" />
                Edit Quiz
              </Button>
            )}
          </div>
        </Card.Header>

        <Card.Body>
          {/* ✅ Show Score Card if Student Has Completed Quiz */}
          {isStudent && hasAttempt && (
            <Card className="mb-4 border-success">
              <Card.Body className="text-center bg-success-subtle">
                <h4 className="text-success mb-3">
                  <FaCheckCircle className="me-2" />
                  Quiz Completed!
                </h4>
                <h2 className="mb-3">Your Score: {userScore} / {quiz.points}</h2>
                <div className="progress mb-3" style={{ height: "25px" }}>
                  <div 
                    className={`progress-bar ${percentage >= 70 ? 'bg-success' : percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage}%
                  </div>
                </div>
                <Badge bg={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'} className="fs-5 px-4 py-2">
                  {percentage >= 70 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Keep Trying!'}
                </Badge>
              </Card.Body>
            </Card>
          )}

          {/* Quiz Information */}
          <h4 className="mb-4">Quiz Information</h4>

          <ListGroup variant="flush" className="mb-4">
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Quiz Type:</strong> 
              <span>{quiz.quizType?.replace(/_/g, ' ') || 'Graded Quiz'}</span>
            </ListGroup.Item>
            
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Total Points:</strong> 
              <span className="badge bg-primary">{quiz.points} pts</span>
            </ListGroup.Item>
            
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Number of Questions:</strong> 
              <span>{quiz.numQuestions || quiz.questions?.length || 0}</span>
            </ListGroup.Item>
            
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Time Limit:</strong> 
              <span>
                {quiz.timeLimit ? (
                  <>
                    <FaClock className="me-2" />
                    {quiz.timeLimit} Minutes
                  </>
                ) : 'No time limit'}
              </span>
            </ListGroup.Item>
            
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Attempts Allowed:</strong> 
              <span>{quiz.howManyAttempts || 1}</span>
            </ListGroup.Item>
            
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Assignment Group:</strong> 
              <span>{quiz.assignmentGroup?.replace(/_/g, ' ') || 'Quizzes'}</span>
            </ListGroup.Item>
          </ListGroup>

          {/* Dates Section */}
          <h5 className="mb-3 mt-4">Important Dates</h5>
          <ListGroup variant="flush" className="mb-4">
            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Due Date:</strong> 
              <span>{formatDate(quiz.dueDate)}</span>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Available From:</strong> 
              <span>{formatDate(quiz.availableDate)}</span>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between">
              <strong>Available Until:</strong> 
              <span>{formatDate(quiz.untilDate)}</span>
            </ListGroup.Item>
          </ListGroup>

          {/* Quiz Settings */}
          {(quiz.shuffleAnswers || quiz.oneQuestionAtATime || quiz.webcamRequired) && (
            <>
              <h5 className="mb-3 mt-4">Quiz Settings</h5>
              <ListGroup variant="flush" className="mb-4">
                {quiz.shuffleAnswers && (
                  <ListGroup.Item>✓ Answers will be shuffled</ListGroup.Item>
                )}
                {quiz.oneQuestionAtATime && (
                  <ListGroup.Item>✓ One question at a time</ListGroup.Item>
                )}
                {quiz.webcamRequired && (
                  <ListGroup.Item>⚠️ Webcam required</ListGroup.Item>
                )}
                {quiz.lockQuestionsAfterAnswering && (
                  <ListGroup.Item>🔒 Questions locked after answering</ListGroup.Item>
                )}
              </ListGroup>
            </>
          )}

          {/* Availability Warnings */}
          {!isAvailable && isStudent && (
            <Alert variant="warning" className="mt-4">
              <strong>Quiz Not Available.</strong> This quiz is not currently available to take.
            </Alert>
          )}

          {!quiz.isPublished && isStudent && (
            <Alert variant="info" className="mt-4">
              <strong>This quiz is not published yet.</strong> Please check back later.
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="mt-4 d-flex gap-3">
            {/* Student Buttons */}
            {isStudent && (
              <>
                {canTakeQuiz ? (
                  <Button 
                    variant="danger" 
                    size="lg"
                    onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
                  >
                    {hasAttempt ? (
                      <>
                        <FaRedo className="me-2" />
                        Retake Quiz
                      </>
                    ) : (
                      <>
                        <FaPlay className="me-2" />
                        Start Quiz
                      </>
                    )}
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" disabled>
                    {!quiz.isPublished ? 'Not Published' : 'Not Available'}
                  </Button>
                )}
                
                <Button 
                  variant="outline-secondary"
                  size="lg"
                  onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
                >
                  Back to All Quizzes
                </Button>
              </>
            )}

            {/* Faculty Buttons */}
            {isFaculty && (
              <>
                <Button 
                  variant="primary"
                  size="lg"
                  onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor/details`)}
                >
                  <FaEdit className="me-2" />
                  Edit Quiz
                </Button>
                <Button 
                  variant="outline-secondary"
                  size="lg"
                  onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
                >
                  Back to Quizzes
                </Button>
              </>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}