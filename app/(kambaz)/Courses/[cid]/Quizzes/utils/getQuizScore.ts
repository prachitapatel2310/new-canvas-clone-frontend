// app/(kambaz)/Courses/[cid]/Quizzes/utils/getQuizScore.ts
export interface QuizAttempt {
  score: number;
  submittedAt: string;
}

export const getQuizScore = (quizId: string, userId: string): QuizAttempt | null => {
  if (typeof window === 'undefined') return null;
  
  const storedScore = localStorage.getItem(`quiz_${quizId}_user_${userId}_score`);
  const submittedAt = localStorage.getItem(`quiz_${quizId}_user_${userId}_submittedAt`);
  
  if (storedScore !== null && submittedAt) {
    return {
      score: Number(storedScore),
      submittedAt
    };
  }
  
  return null;
};

export const clearQuizAttempt = (quizId: string, userId: string): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(`quiz_${quizId}_user_${userId}_score`);
  localStorage.removeItem(`quiz_${quizId}_user_${userId}_answers`);
  localStorage.removeItem(`quiz_${quizId}_user_${userId}_submittedAt`);
};