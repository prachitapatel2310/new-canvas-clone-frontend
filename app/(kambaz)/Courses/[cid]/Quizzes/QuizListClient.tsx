// app/(kambaz)/Courses/[cid]/Quizzes/QuizListClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ListGroup, Button, Dropdown, Form } from "react-bootstrap";
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
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function QuizListClient() {
  const { cid } = useParams() as { cid?: string };
  // Quizzes now read from the schema-aligned reducer
  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const dispatch = useDispatch();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const role = (currentUser?.role ?? "").toUpperCase();
  const isFaculty = ["ADMIN", "FACULTY", "INSTRUCTOR"].includes(role);

  const fetchQuizzes = async () => {
    if (!cid) return;
    setLoading(true);
    try {
      // Fetches quizzes via the backend REST API
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid]);

  const handleCreateQuiz = async () => {
    if (!cid || !isFaculty) return;
    try {
      const newQuizData = { 
        title: "New Quiz",
        course: cid,
        description: "",
        questions: [],
      };
      // Creates quiz on the backend and gets the new ID
      const newQuiz = await client.createQuizForCourse(cid, newQuizData);
      
      // Update local state by re-fetching
      await fetchQuizzes(); 
      
      // Navigate to the editor for the new quiz
      router.push(`/Courses/${cid}/Quizzes/${newQuiz._id}/editor/details`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create new quiz.");
    }
  };

  const handleDelete = async (quizId: string) => {
    if (!isFaculty || !confirm('Are you sure you want to delete this quiz?')) return;
    try {
      // Deletes quiz on the backend
      await client.deleteQuiz(quizId);
      // Updates Redux state
      dispatch(deleteQuizInReducer(quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz on server.");
    }
  };

  const handleTogglePublished = async (quiz: Quiz) => {
    if (!isFaculty) return;
    try {
      // Uses the schema-aligned field name `isPublished`
      const newPublishedStatus = !quiz.isPublished; 
      // Toggles published status on the backend
      await client.toggleQuizPublished(quiz._id, newPublishedStatus);
      // Updates Redux state
      dispatch(togglePublishedInReducer(quiz._id));
    } catch (error) {
      console.error("Error toggling published status:", error);
      alert("Failed to toggle publish status.");
    }
  };

  // Filters quizzes: students only see published quizzes
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
          // Use the schema-aligned date fields for utility function
          const availability = getAvailability(quiz.availableDate, quiz.untilDate); 
          
          // Faculty go to details, Students go directly to take the quiz
          const linkHref = isFaculty 
            ? `/Courses/${cid}/Quizzes/${quiz._id}/details` 
            : `/Courses/${cid}/Quizzes/${quiz._id}/take`;

          // Format points/questions for display
          const displayPoints = quiz.points === 0 ? "Ungraded" : `${quiz.points} pts`;
          const displayQs = `${quiz.questions?.length ?? 0} Qs`;

          return (
            <ListGroup.Item key={quiz._id} className="p-3 d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-center">
                <span className="me-3 fs-4">📄</span>
                <div>
                  <Link href={linkHref} className="h5 text-decoration-none text-danger">
                    {quiz.title}
                  </Link>
                  <div className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>
                    {quiz.quizType.replace('_', ' ')} | 
                    <span className={`ms-1 ${availability.status === 'Available' ? 'text-success' : 'text-danger'}`}>
                      {availability.message}
                    </span> | 
                    Due {quiz.dueDate} | {displayPoints} | {displayQs}
                  </div>
                </div>
              </div>
              
              {isFaculty && (
                <div className="d-flex gap-2 align-items-center">
                  <span 
                    onClick={() => handleTogglePublished(quiz)} 
                    style={{ cursor: 'pointer' }}
                    // Use the schema-aligned field name `isPublished`
                    title={quiz.isPublished ? "Published" : "Unpublished"}
                  >
                    {quiz.isPublished 
                      ? <FaCheckCircle className="text-success fs-5" /> 
                      : <MdDoNotDisturbAlt className="text-danger fs-5" />
                    }
                  </span>

                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" size="sm">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} href={`/Courses/${cid}/Quizzes/${quiz._id}/editor/details`}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDelete(quiz._id)}>
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