// app/Courses/[cid]/Quizzes/[qid]/editor/questions/page.tsx
export const dynamic = "force-dynamic";
import QuizQuestionsEditor from "./QuizQuestionsEditor";
import QuizEditorLayout from "../QuizEditorLayout";

export default function Page() {
  return (
    <QuizEditorLayout>
      <QuizQuestionsEditor />
    </QuizEditorLayout>
  );
}