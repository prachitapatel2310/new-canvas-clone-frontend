// app/Courses/[cid]/Quizzes/[qid]/take/page.tsx
export const dynamic = "force-dynamic";
import QuizTake from "./QuizTake";

export default function Page() {
  return <QuizTake />;
}