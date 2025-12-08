// app/Courses/[cid]/Quizzes/[qid]/preview/page.tsx
export const dynamic = "force-dynamic";
import QuizPreview from "./QuizPreview";

export default function Page() {
  return <QuizPreview />;
}