export const dynamic = "force-dynamic";

import QuizListClient from "./QuizListClient";

export default function Page() {
  return (
    <div id="wd-quizzes">
      <QuizListClient />
    </div>
  );
}
