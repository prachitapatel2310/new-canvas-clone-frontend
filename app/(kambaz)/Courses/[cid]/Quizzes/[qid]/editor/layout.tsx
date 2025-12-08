// app/(kambaz)/Courses/[cid]/Quizzes/[qid]/editor/layout.tsx
import QuizEditorLayout from "./QuizEditorLayout";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <QuizEditorLayout>{children}</QuizEditorLayout>;
}