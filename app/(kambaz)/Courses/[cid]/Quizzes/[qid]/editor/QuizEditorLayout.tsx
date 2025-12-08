// app/(kambaz)/Courses/[cid]/Quizzes/[qid]/editor/QuizEditorLayout.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import React, { ReactNode, useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button, Nav } from "react-bootstrap";
import type { RootState } from "../../../../../store";
import { Quiz, updateQuiz } from "../../reducer";
import { QuizEditorProvider, useQuizEditor } from "./QuizEditorContext";
import * as client from "../../client";

function QuizEditorLayoutInner({ children }: { children: ReactNode }) {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { saveHandler } = useQuizEditor();

  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const currentQuiz: Quiz | undefined = quizzes.find((q) => q._id === qid);
  
  // ✅ ADD: State for quiz title
  const [quizTitle, setQuizTitle] = useState(currentQuiz?.title || "");

  // ✅ ADD: Fetch quiz if not in Redux
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!currentQuiz && qid) {
        try {
          const fetchedQuiz = await client.findQuizById(qid);
          setQuizTitle(fetchedQuiz.title);
          dispatch(updateQuiz(fetchedQuiz));
        } catch (error) {
          console.error("Error fetching quiz:", error);
          setQuizTitle("Quiz");
        }
      } else if (currentQuiz) {
        setQuizTitle(currentQuiz.title);
      }
    };
    fetchQuiz();
  }, [qid, currentQuiz, dispatch]);

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

  const isDetailsActive = pathname?.includes('/editor/details');
  const isQuestionsActive = pathname?.includes('/editor/questions');

  return (
    <div id="wd-quiz-editor-layout">
      {/* ✅ ADD: Back to Quizzes button */}
      <div className="mb-3">
      <Button 
        variant="outline-secondary" 
        size="sm"
        onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
      >
        ← Back to Quizzes
      </Button>
      </div>
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

      <h3 className="text-danger">{quizTitle || "Loading Quiz..."}</h3>
      <hr />

      <Nav variant="tabs" className="mb-3">
        <Nav.Item>
          <Nav.Link 
            href={`/Courses/${cid}/Quizzes/${qid}/editor/details`}
            active={isDetailsActive}
          >
            Details
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            href={`/Courses/${cid}/Quizzes/${qid}/editor/questions`}
            active={isQuestionsActive}
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