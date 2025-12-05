
import { use } from 'react';

export default function Quizzes({ params }: { params: Promise<{ cid: string }> }) {
  const { cid } = use(params);
  
  return (
    <div id="wd-quizzes">
      <h2>Quizzes</h2>
      <hr />
      <div className="alert alert-warning" role="alert">
        <h3>Quizzes Integration Coming Soon!</h3>
        <p className="mb-0">This feature will be available in a future update.</p>
      </div>
    </div>
  );
}