// app/Courses/[cid]/Quizzes/[qid]/editor/QuizEditorLayout.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button, Nav } from "react-bootstrap";
import type { RootState } from "../../../../../store";
import { Quiz, updateQuiz } from "../../../Quizzes/reducer";
import { QuizEditorProvider, useQuizEditor } from "./QuizEditorContext";

function QuizEditorLayoutInner({ children }: { children: ReactNode }) {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { saveHandler } = useQuizEditor();

  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const currentQuiz: Quiz | undefined = quizzes.find((q) => q._id === qid);
  const quizTitle = currentQuiz?.title || "Loading Quiz...";

  const handleSaveAndPublish = async () => {
    if (!saveHandler) {
      alert("Editor is not ready yet. Please wait.");
      return;
    }
    
    const savedQuiz = await saveHandler(true);
    if (savedQuiz) {
      dispatch(updateQuiz(savedQuiz));
      router.push(`/Courses/${cid}/Quizzes`);
    }
  };

  const handleSave = async () => {
    if (!saveHandler) {
      alert("Editor is not ready yet. Please wait.");
      return;
    }
    
    const savedQuiz = await saveHandler(false);
    if (savedQuiz) {
      dispatch(updateQuiz(savedQuiz));
      alert("Quiz saved successfully!");
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? Unsaved changes will be lost.")) {
      router.push(`/Courses/${cid}/Quizzes`);
    }
  };

  return (
    <div id="wd-quiz-editor-layout">
      <div className="d-flex justify-content-end align-items-center mb-3">
        <Button variant="secondary" className="me-2" onClick={handleCancel}>
          Cancel
        </Button>
        <Button 
          variant="danger" 
          className="me-2" 
          onClick={handleSaveAndPublish}
          id="wd-save-publish-quiz-btn"
        >
          Save & Publish
        </Button>
        <Button 
          variant="success" 
          onClick={handleSave}
          id="wd-save-quiz-btn"
        >
          Save
        </Button>
      </div>

      <h3 className="text-danger">{quizTitle}</h3>
      <hr />

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            href={`/Courses/${cid}/Quizzes/${qid}/editor/details`}
            active={pathname?.endsWith('details')}
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            href={`/Courses/${cid}/Quizzes/${qid}/editor/questions`}
            active={pathname?.endsWith('questions')}
          >
            Questions
          </Nav.Link>
        </Nav.Item>
      </Nav>

      <div id="wd-quiz-editor-content">
        {children}
      </div>
    </div>
  );
}

export default function QuizEditorLayout({ children }: { children: ReactNode }) {
  return (
    <QuizEditorProvider>
      <QuizEditorLayoutInner>{children}</QuizEditorLayoutInner>
    </QuizEditorProvider>
  );
}