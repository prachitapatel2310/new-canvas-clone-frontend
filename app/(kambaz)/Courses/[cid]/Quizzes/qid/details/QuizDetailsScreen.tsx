// app/Courses/[cid]/Quizzes/[qid]/details/QuizDetailsScreen.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Button, Card, ListGroup } from "react-bootstrap";
import { Quiz } from "../../../Quizzes/reducer";
import type { RootState } from "../../../../../store";
import * as client from "../../../Quizzes/client";
import { FaPencilAlt } from "react-icons/fa";
import { getAvailability } from "../../quiz.utils";

export default function QuizDetailsScreen() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();

  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const quiz: Quiz | undefined = quizzes.find((q) => q._id === qid);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [loading, setLoading] = useState(true);
  const [localQuiz, setLocalQuiz] = useState<Quiz | null>(quiz || null);

  const role = (currentUser?.role ?? "").toUpperCase();
  const isFaculty = ["ADMIN", "FACULTY", "INSTRUCTOR"].includes(role);
  const isStudent = !isFaculty;

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid) return;
      setLoading(true);
      try {
        const fetchedQuiz = await client.findQuizById(qid);
        setLocalQuiz(fetchedQuiz);
      } catch (error) {
        console.error("Error fetching quiz details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!quiz && qid !== 'new') {
      fetchQuiz();
    } else if (quiz) {
      setLocalQuiz(quiz);
      setLoading(false);
    }
  }, [qid, quiz]);
  
  if (loading || !localQuiz) {
    return <div className="p-4">Loading quiz details...</div>;
  }

  const { status, message } = getAvailability(localQuiz.available, localQuiz.until);
  const canTakeQuiz = isStudent && localQuiz.published && status === 'Available';

  const renderFacultyView = () => (
    <>
      <div className="d-flex justify-content-end align-items-center mb-3">
        <Button variant="secondary" className="me-2" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}>
          Preview
        </Button>
        <Button variant="danger" className="me-2" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/editor/details`)}>
          <FaPencilAlt className="me-1" /> Edit
        </Button>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Close
        </Button>
      </div>
      <hr />
      <Card className="p-4">
        <Card.Title className="text-danger">{localQuiz.title}</Card.Title>
        <hr />
        <div dangerouslySetInnerHTML={{ __html: localQuiz.description }} className="mb-4" />
        <ListGroup variant="flush">
          <ListGroup.Item><strong>Quiz Type:</strong> {localQuiz.quizType.replace('_', ' ')}</ListGroup.Item>
          <ListGroup.Item><strong>Points:</strong> {localQuiz.points}</ListGroup.Item>
          <ListGroup.Item><strong>Assignment Group:</strong> {localQuiz.assignmentGroup}</ListGroup.Item>
          <ListGroup.Item><strong>Shuffle Answers:</strong> {localQuiz.shuffleAnswers ? 'Yes' : 'No'}</ListGroup.Item>
          <ListGroup.Item><strong>Time Limit:</strong> {localQuiz.timeLimit} Minutes</ListGroup.Item>
          <ListGroup.Item><strong>Multiple Attempts:</strong> {localQuiz.multipleAttempts ? 'Yes' : 'No'}</ListGroup.Item>
          <ListGroup.Item><strong>Show Correct Answers:</strong> {localQuiz.showCorrectAnswers.replace('_', ' ')}</ListGroup.Item>
          <ListGroup.Item><strong>Access Code:</strong> {localQuiz.accessCode || 'None'}</ListGroup.Item>
          <ListGroup.Item><strong>One Question at a Time:</strong> {localQuiz.oneQuestionAtATime ? 'Yes' : 'No'}</ListGroup.Item>
          <ListGroup.Item><strong>Webcam Required:</strong> {localQuiz.webcamRequired ? 'Yes' : 'No'}</ListGroup.Item>
          <ListGroup.Item><strong>Lock Questions After Answering:</strong> {localQuiz.lockQuestionsAfterAnswering ? 'Yes' : 'No'}</ListGroup.Item>
          <ListGroup.Item><strong>Due Date:</strong> {localQuiz.due}</ListGroup.Item>
          <ListGroup.Item><strong>Available Date:</strong> {localQuiz.available}</ListGroup.Item>
          <ListGroup.Item><strong>Until Date:</strong> {localQuiz.until}</ListGroup.Item>
        </ListGroup>
      </Card>
    </>
  );

  const renderStudentView = () => (
    <Card className="p-4">
      <Card.Title className="text-danger">{localQuiz.title}</Card.Title>
      <hr />
      <ListGroup variant="flush">
        <ListGroup.Item><strong>Quiz Type:</strong> {localQuiz.quizType.replace('_', ' ')}</ListGroup.Item>
        <ListGroup.Item><strong>Points:</strong> {localQuiz.points}</ListGroup.Item>
        <ListGroup.Item><strong>Questions:</strong> {localQuiz.questions.length}</ListGroup.Item>
        <ListGroup.Item><strong>Time Limit:</strong> {localQuiz.timeLimit} Minutes</ListGroup.Item>
        <ListGroup.Item><strong>Attempts:</strong> {localQuiz.attemptsAllowed}</ListGroup.Item>
        <ListGroup.Item><strong>Due:</strong> {localQuiz.due}</ListGroup.Item>
      </ListGroup>
      <div className="mt-4">
        {canTakeQuiz ? (
          <Button 
            variant="success" 
            size="lg" 
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
          >
            Start Quiz
          </Button>
        ) : (
          <div className="alert alert-warning">
            {message}. You cannot start the quiz at this time.
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div id="wd-quiz-details">
      <h2>Quiz Details</h2>
      <hr />
      {isFaculty ? renderFacultyView() : renderStudentView()}
    </div>
  );
}