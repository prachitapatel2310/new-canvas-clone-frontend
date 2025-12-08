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
import { FaClock, FaEdit, FaCheckCircle, FaPlay } from "react-icons/fa";

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
        day: 'numeric' 
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading || !quiz) {
    return <div className="p-4">Loading quiz details...</div>;
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
        <Card.Header className="bg-white">
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
          {/* ✅ Show Score if Student Has Taken Quiz */}
          {isStudent && hasAttempt && (
            <Alert variant="success" className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-0">
                    <FaCheckCircle className="me-2" />
                    Quiz Completed!
                  </h4>
                  <h3 className="mt-2 mb-0">Score: {userScore} / {quiz.points} ({percentage}%)</h3>
                </div>
                <Badge 
                  bg={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'}
                  className="fs-5 p-3"
                >
                  {percentage}%
                </Badge>
              </div>
            </Alert>
          )}

          <h4 className="mb-4">Quiz Details</h4>

          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Quiz Type:</strong> {quiz.quizType?.replace(/_/g, ' ') || 'Graded Quiz'}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <strong>Points:</strong> {quiz.points}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <strong>Questions:</strong> {quiz.numQuestions || quiz.questions?.length || 0}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <strong>Time Limit:</strong> {quiz.timeLimit ? (
                <>
                  <FaClock className="me-2" />
                  {quiz.timeLimit} Minutes
                </>
              ) : 'No time limit'}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <strong>Attempts Allowed:</strong> {quiz.howManyAttempts || 1}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <strong>Due:</strong> {formatDate(quiz.dueDate)}
            </ListGroup.Item>

            <ListGroup.Item>
              <strong>Available From:</strong> {formatDate(quiz.availableDate)}
            </ListGroup.Item>

            <ListGroup.Item>
              <strong>Available Until:</strong> {formatDate(quiz.untilDate)}
            </ListGroup.Item>
          </ListGroup>

          {/* Availability Warning */}
          {!isAvailable && isStudent && (
            <Alert variant="warning" className="mt-4">
              <strong>Unknown Availability.</strong> You cannot start the quiz at this time.
            </Alert>
          )}

          {/* Not Published Warning */}
          {!quiz.isPublished && isStudent && (
            <Alert variant="info" className="mt-4">
              <strong>This quiz is not published yet.</strong> Please check back later.
            </Alert>
          )}

          {/* Student Actions */}
          {isStudent && (
            <div className="mt-4 d-flex gap-2">
              {canTakeQuiz ? (
                <Button 
                  variant="danger" 
                  size="lg"
                  onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
                >
                  <FaPlay className="me-2" />
                  {hasAttempt ? 'Retake Quiz' : 'Start Quiz'}
                </Button>
              ) : (
                <Button variant="secondary" size="lg" disabled>
                  Quiz Not Available
                </Button>
              )}
              
              <Button 
                variant="outline-secondary"
                onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
              >
                Back to Quizzes
              </Button>
            </div>
          )}

          {/* Faculty Actions */}
          {isFaculty && (
            <div className="mt-4 d-flex gap-2">
              <Button 
                variant="primary"
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor/details`)}
              >
                <FaEdit className="me-2" />
                Edit
              </Button>
              <Button 
                variant="outline-secondary"
                onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
              >
                Back to Quizzes
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}