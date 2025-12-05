// app/Courses/[cid]/Quizzes/[qid]/editor/details/QuizDetailsEditor.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Form, Row, Col, Card } from "react-bootstrap";
import { Quiz } from "../../../../Quizzes/reducer";
import type { RootState } from "../../../../../../store";
import * as client from "../../../../Quizzes/client";
import { useQuizEditor } from "../QuizEditorContext";

export default function QuizDetailsEditor() {
  const { cid, qid } = useParams() as { cid: string; qid: string };
  const router = useRouter();
  const { setSaveHandler } = useQuizEditor();

  const quizzes: Quiz[] = useSelector((state: RootState) => (state.quizzesReducer as any).quizzes) || [];
  const initialQuiz = quizzes.find((q) => q._id === qid) || null;

  const [quizData, setQuizData] = useState<Partial<Quiz>>({ 
    title: "", 
    description: "", 
    quizType: "GRADED_QUIZ",
    assignmentGroup: "Quizzes",
    points: 0,
    shuffleAnswers: true,
    timeLimit: 20,
    multipleAttempts: false,
    attemptsAllowed: 1,
    showCorrectAnswers: "IMMEDIATELY",
    accessCode: "",
    oneQuestionAtATime: true,
    webcamRequired: false,
    lockQuestionsAfterAnswering: false,
    due: "",
    available: "",
    until: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!qid || qid === 'new') return;
      try {
        const fetchedQuiz = await client.findQuizById(qid);
        setQuizData(fetchedQuiz);
      } catch (error) {
        console.error("Error fetching quiz for editor:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (initialQuiz) {
      setQuizData(initialQuiz);
      setLoading(false);
    } else {
      fetchQuiz();
    }
  }, [qid, initialQuiz]);
  
  // Register save handler with context
  useEffect(() => {
    const saveQuiz = async (publish: boolean): Promise<Quiz | null> => {
      if (!quizData.title) {
        alert("Quiz title is required.");
        return null;
      }
      
      const finalQuizData: Quiz = {
        ...initialQuiz,
        ...quizData,
        _id: qid,
        course: cid,
        published: publish,
      } as Quiz;

      try {
        let savedQuiz: Quiz;
        if (initialQuiz) {
          savedQuiz = await client.updateQuiz(finalQuizData);
        } else {
          savedQuiz = await client.createQuizForCourse(cid, finalQuizData);
          router.replace(`/Courses/${cid}/Quizzes/${savedQuiz._id}/editor/details`);
        }
        return savedQuiz;
      } catch (error) {
        console.error("Error saving quiz details:", error);
        alert("Failed to save quiz details.");
        return null;
      }
    };

    setSaveHandler(saveQuiz);
  }, [quizData, initialQuiz, qid, cid, setSaveHandler, router]);

  if (loading) return <p>Loading editor...</p>;
  
  return (
    <Card className="p-4">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control 
            value={quizData.title} 
            onChange={(e) => setQuizData({ ...quizData, title: e.target.value })} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={4} 
            value={quizData.description} 
            onChange={(e) => setQuizData({ ...quizData, description: e.target.value })} 
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Quiz Type</Form.Label>
              <Form.Select 
                value={quizData.quizType} 
                onChange={(e) => setQuizData({ ...quizData, quizType: e.target.value as Quiz["quizType"] })}
              >
                <option value="GRADED_QUIZ">Graded Quiz</option>
                <option value="PRACTICE_QUIZ">Practice Quiz</option>
                <option value="GRADED_SURVEY">Graded Survey</option>
                <option value="UNGRADED_SURVEY">Ungraded Survey</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Assignment Group</Form.Label>
              <Form.Select 
                value={quizData.assignmentGroup} 
                onChange={(e) => setQuizData({ ...quizData, assignmentGroup: e.target.value as Quiz["assignmentGroup"] })}
              >
                <option value="Quizzes">Quizzes</option>
                <option value="Exams">Exams</option>
                <option value="Assignments">Assignments</option>
                <option value="Project">Project</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Check 
            type="checkbox" 
            label="Shuffle Answers"
            checked={quizData.shuffleAnswers}
            onChange={(e) => setQuizData({ ...quizData, shuffleAnswers: e.target.checked })}
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Time Limit (Minutes)</Form.Label>
          <Form.Control 
            type="number" 
            value={quizData.timeLimit} 
            onChange={(e) => setQuizData({ ...quizData, timeLimit: Number(e.target.value) })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check 
            type="checkbox" 
            label="Multiple Attempts"
            checked={quizData.multipleAttempts}
            onChange={(e) => setQuizData({ ...quizData, multipleAttempts: e.target.checked })}
          />
          {quizData.multipleAttempts && (
            <div className="ms-4 mt-2">
              <Form.Label>How Many Attempts</Form.Label>
              <Form.Control 
                type="number" 
                value={quizData.attemptsAllowed} 
                onChange={(e) => setQuizData({ ...quizData, attemptsAllowed: Number(e.target.value) })}
                min={1}
              />
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Show Correct Answers</Form.Label>
          <Form.Select 
            value={quizData.showCorrectAnswers} 
            onChange={(e) => setQuizData({ ...quizData, showCorrectAnswers: e.target.value as Quiz["showCorrectAnswers"] })}
          >
            <option value="IMMEDIATELY">Immediately</option>
            <option value="AFTER_LAST_ATTEMPT">After Last Attempt</option>
            <option value="NEVER">Never</option>
          </Form.Select>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Access Code</Form.Label>
          <Form.Control 
            value={quizData.accessCode} 
            onChange={(e) => setQuizData({ ...quizData, accessCode: e.target.value })} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check 
            type="checkbox" 
            label="One Question at a Time"
            checked={quizData.oneQuestionAtATime}
            onChange={(e) => setQuizData({ ...quizData, oneQuestionAtATime: e.target.checked })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check 
            type="checkbox" 
            label="Webcam Required"
            checked={quizData.webcamRequired}
            onChange={(e) => setQuizData({ ...quizData, webcamRequired: e.target.checked })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check 
            type="checkbox" 
            label="Lock Questions After Answering"
            checked={quizData.lockQuestionsAfterAnswering}
            onChange={(e) => setQuizData({ ...quizData, lockQuestionsAfterAnswering: e.target.checked })}
          />
        </Form.Group>

        <Row className="mt-4">
          <Col>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control 
                type="date" 
                value={quizData.due} 
                onChange={(e) => setQuizData({ ...quizData, due: e.target.value })} 
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Available Date</Form.Label>
              <Form.Control 
                type="date" 
                value={quizData.available} 
                onChange={(e) => setQuizData({ ...quizData, available: e.target.value })} 
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Until Date</Form.Label>
              <Form.Control 
                type="date" 
                value={quizData.until} 
                onChange={(e) => setQuizData({ ...quizData, until: e.target.value })} 
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}