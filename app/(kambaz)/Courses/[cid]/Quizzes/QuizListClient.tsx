// app/(kambaz)/Courses/[cid]/Quizzes/QuizListClient.tsx (or wherever your quiz list is)
"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Quiz } from "./reducer";
import type { RootState } from "../../../store";
import { FaCheckCircle, FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";
import { Dropdown, Badge } from "react-bootstrap";
import { getQuizScore } from "./utils/getQuizScore";

export default function QuizListClient() {
  const router = useRouter();
  const { cid } = useParams() as { cid: string };
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const quizzes: Quiz[] = useSelector((state: RootState) => (state as any).quizzesReducer?.quizzes || []);

  const [quizScores, setQuizScores] = useState<Record<string, number | null>>({});

  const isStudent = !["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser?.role ?? "").toUpperCase());
  const isFaculty = ["ADMIN", "FACULTY", "INSTRUCTOR"].includes((currentUser?.role ?? "").toUpperCase());

  // Load scores from localStorage
  useEffect(() => {
    if (isStudent && currentUser?._id) {
      const scores: Record<string, number | null> = {};
      quizzes.forEach(quiz => {
        const attempt = getQuizScore(quiz._id, currentUser._id);
        scores[quiz._id] = attempt?.score ?? null;
      });
      setQuizScores(scores);
    }
  }, [quizzes, currentUser, isStudent]);

  const handleQuizClick = (quizId: string) => {
    if (isFaculty) {
      router.push(`/Courses/${cid}/Quizzes/${quizId}/details`);
    } else {
      router.push(`/Courses/${cid}/Quizzes/${quizId}/take`);
    }
  };

  return (
    <div className="wd-quiz-list">
      <h3 className="mb-3">Quizzes ({quizzes.length})</h3>

      {quizzes.length === 0 ? (
        <div className="alert alert-info">
          No quizzes available yet. {isFaculty && "Click '+ Quiz' to create one."}
        </div>
      ) : (
        <div className="list-group">
          {quizzes.map((quiz) => {
            const userScore = quizScores[quiz._id];
            const hasAttempt = userScore !== null && userScore !== undefined;

            return (
              <div
                key={quiz._id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
              >
                <div className="flex-grow-1" onClick={() => handleQuizClick(quiz._id)} style={{ cursor: 'pointer' }}>
                  {/* Quiz Icon and Title */}
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-3 text-success fs-4">📝</span>
                    <div>
                      <h5 className="mb-1">
                        <Link href={`/Courses/${cid}/Quizzes/${quiz._id}/${isFaculty ? 'details' : 'take'}`} className="text-decoration-none text-dark">
                          {quiz.title}
                        </Link>
                      </h5>
                      <div className="d-flex gap-3 text-muted small">
                        <span>{quiz.quizType || 'Graded Quiz'}</span>
                        {quiz.availableDate && <span>Available: {new Date(quiz.availableDate).toLocaleDateString()}</span>}
                        {quiz.dueDate && <span>Due: {new Date(quiz.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Quiz Stats */}
                  <div className="d-flex gap-3 text-muted small">
                    <span>{quiz.points} pts</span>
                    <span>{quiz.numQuestions || 0} Questions</span>
                    
                    {/* ✅ Show Score for Students */}
                    {isStudent && hasAttempt && (
                      <Badge bg="success" className="ms-2">
                        <FaCheckCircle className="me-1" />
                        Score: {userScore}/{quiz.points}
                      </Badge>
                    )}
                    
                    {/* Show if not taken yet */}
                    {isStudent && !hasAttempt && quiz.isPublished && (
                      <Badge bg="warning" text="dark">Not Attempted</Badge>
                    )}
                  </div>
                </div>

                {/* Faculty Actions */}
                {isFaculty && (
                  <Dropdown>
                    <Dropdown.Toggle variant="link" className="text-dark p-0">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}/editor/details`)}>
                        <FaEdit className="me-2" /> Edit
                      </Dropdown.Item>
                      <Dropdown.Item className="text-danger">
                        <FaTrash className="me-2" /> Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}