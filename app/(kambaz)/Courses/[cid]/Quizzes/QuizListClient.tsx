// app/(kambaz)/Courses/[cid]/Quizzes/QuizListClient.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ListGroup, Button, Dropdown, Form, Badge } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store";
import { FaCheckCircle, FaEllipsisV, FaPlus } from "react-icons/fa";
import { MdDoNotDisturbAlt } from "react-icons/md";
import * as client from "../Quizzes/client";
import { 
  Quiz, 
  setQuizzes, 
  deleteQuiz as deleteQuizInReducer,
  togglePublished as togglePublishedInReducer,
} from "../Quizzes/reducer";
import { getAvailability } from "./quiz.utils";

const getQuizScore = (quizId: string, userId: string): number | null => {
  if (typeof window === 'undefined') return null;
  const storedScore = localStorage.getItem(`quiz_${quizId}_user_${userId}_score`);
  return storedScore !== null ? Number(storedScore) : null;
};

export default function QuizListClient() {
  const { cid } = useParams() as { cid?: string };
  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [quizScores, setQuizScores] = useState<Record<string, number | null>>({});

  const role = (currentUser?.role ?? "").toUpperCase();
  const isFaculty = ["ADMIN", "FACULTY", "INSTRUCTOR"].includes(role);
  const isStudent = !isFaculty;

  const fetchQuizzes = async () => {
    if (!cid) return;
    setLoading(true);
    try {
      const fetchedQuizzes = await client.findQuizzesForCourse(cid);
      dispatch(setQuizzes(fetchedQuizzes));
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cid) {
      fetchQuizzes();
    }
  }, [cid]);

  useEffect(() => {
    if (isStudent && currentUser?._id) {
      const scores: Record<string, number | null> = {};
      quizzes.forEach(quiz => {
        scores[quiz._id] = getQuizScore(quiz._id, currentUser._id);
      });
      setQuizScores(scores);
    }
  }, [quizzes, currentUser, isStudent]);

  const handleCreateQuiz = async () => {
    if (!cid || !isFaculty) return;
    try {
      const newQuizData = { 
        title: "New Quiz",
        course: cid,
        description: "",
        questions: [],
      };
      const newQuiz = await client.createQuizForCourse(cid, newQuizData);
      await fetchQuizzes(); 
      router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}/editor/details`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create new quiz.");
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!isFaculty || !confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await client.deleteQuiz(quizId);
      dispatch(deleteQuizInReducer(quizId));
      
      if (currentUser?._id) {
        localStorage.removeItem(`quiz_${quizId}_user_${currentUser._id}_score`);
        localStorage.removeItem(`quiz_${quizId}_user_${currentUser._id}_answers`);
        localStorage.removeItem(`quiz_${quizId}_user_${currentUser._id}_submittedAt`);
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz on server.");
    }
  };

  const handleTogglePublished = async (quiz: Quiz) => {
    if (!isFaculty) return;
    try {
      const newPublishedStatus = !quiz.isPublished; 
      await client.toggleQuizPublished(quiz._id, newPublishedStatus);
      dispatch(togglePublishedInReducer(quiz._id));
    } catch (error) {
      console.error("Error toggling published status:", error);
      alert("Failed to toggle publish status.");
    }
  };

  const filteredQuizzes = quizzes
    .filter((q: Quiz) => isFaculty || q.isPublished)
    .filter((q: Quiz) => q.title.toLowerCase().includes(search.trim().toLowerCase()));

  if (loading) {
    return (
      <div className="p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-2">Loading Quizzes...</span>
      </div>
    );
  }

  return (
    <div id="wd-quizzes-list-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          placeholder="Search for Quizzes"
          id="wd-search-quiz"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="me-2 w-25"
        />

        {isFaculty && (
          <Button variant="danger" size="sm" onClick={handleCreateQuiz} id="wd-add-quiz-btn">
            <FaPlus className="me-1" /> Quiz
          </Button>
        )}
      </div>

      <hr />

      <h3 className="mb-3">
        Quizzes 
        <small className="text-muted"> ({filteredQuizzes.length})</small>
      </h3>

      <ListGroup id="wd-quiz-list" className="mt-3">
        {filteredQuizzes.length === 0 && (
          <div className="alert alert-info text-center">
            {isFaculty ? "No quizzes yet. Click '+ Quiz' to create one." : "No published quizzes are currently available."}
          </div>
        )}
        {filteredQuizzes.map((quiz: Quiz) => {
          const availability = getAvailability(quiz.availableDate, quiz.untilDate); 
          
          // ✅ FIXED: Students → details page, Faculty → editor
          const linkHref = isFaculty 
            ? `/Courses/${cid}/Quizzes/${quiz._id}/editor/details`
            : `/Courses/${cid}/Quizzes/${quiz._id}/details`;

          const displayPoints = quiz.points === 0 ? "Ungraded" : `${quiz.points} pts`;
          const displayQs = `${quiz.questions?.length ?? 0} Qs`;

          const userScore = isStudent && currentUser?._id ? quizScores[quiz._id] : null;
          const hasAttempt = userScore !== null && userScore !== undefined;
          const percentage = hasAttempt && quiz.points > 0 ? Math.round((userScore / quiz.points) * 100) : 0;

          return (
            <ListGroup.Item key={quiz._id} className="p-3 d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-3 fs-4">📄</span>
                  <div className="flex-grow-1">
                    <Link href={linkHref} className="h5 text-decoration-none text-danger">
                      {quiz.title}
                    </Link>
                    <div className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
                      {quiz.quizType?.replace(/_/g, ' ') || 'Graded Quiz'} | 
                      <span className={`ms-1 ${availability.status === 'Available' ? 'text-success' : 'text-danger'}`}>
                        {availability.message}
                      </span> | 
                      Due {quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : 'No due date'} | 
                      {displayPoints} | {displayQs}
                      
                      {isStudent && hasAttempt && (
                        <Badge 
                          bg={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'danger'} 
                          className="ms-2"
                        >
                          <FaCheckCircle className="me-1" />
                          Score: {userScore}/{quiz.points} ({percentage}%)
                        </Badge>
                      )}
                      
                      {isStudent && !hasAttempt && quiz.isPublished && (
                        <Badge bg="secondary" className="ms-2">
                          Not Attempted
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {isFaculty && (
                <div className="d-flex gap-2 align-items-center">
                  <span 
                    onClick={() => handleTogglePublished(quiz)} 
                    style={{ cursor: 'pointer' }}
                    title={quiz.isPublished ? "Published" : "Unpublished"}
                  >
                    {quiz.isPublished 
                      ? <FaCheckCircle className="text-success fs-5" /> 
                      : <MdDoNotDisturbAlt className="text-danger fs-5" />
                    }
                  </span>

                  <Dropdown>
                    <Dropdown.Toggle variant="link" className="text-dark p-0">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} href={`/Courses/${cid}/Quizzes/${quiz._id}/editor/details`}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(quiz._id)} className="text-danger">
                        Delete
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleTogglePublished(quiz)}>
                        {quiz.isPublished ? 'Unpublish' : 'Publish'}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}