// app/Courses/[cid]/Quizzes/[qid]/editor/details/page.tsx
export const dynamic = "force-dynamic";
import QuizDetailsEditor from "./QuizDetailsEditor";
import QuizEditorLayout from "../QuizEditorLayout";

export default function Page() {
  return (
    <QuizEditorLayout>
      <QuizDetailsEditor />
    </QuizEditorLayout>
  );
}