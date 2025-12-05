// app/Courses/Quizzes/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_THE_BLANK";

export interface QuizQuestion {
  _id: string;
  title: string;
  type: QuestionType;
  points: number;
  questionText: string;
  choices?: { text: string; isCorrect: boolean }[];
  correctAnswer?: boolean;
  correctAnswers?: string[];
}

export interface Quiz {
  _id: string;
  title: string;
  course?: string;
  description: string;
  quizType: "GRADED_QUIZ" | "PRACTICE_QUIZ" | "GRADED_SURVEY" | "UNGRADED_SURVEY";
  points: number;
  assignmentGroup: "Quizzes" | "Exams" | "Assignments" | "Project";
  shuffleAnswers: boolean;
  timeLimit: number;
  multipleAttempts: boolean;
  attemptsAllowed: number;
  showCorrectAnswers: "IMMEDIATELY" | "AFTER_LAST_ATTEMPT" | "NEVER";
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  due: string;
  available: string;
  until: string;
  published: boolean;
  questions: QuizQuestion[];
  numQuestions?: number;
}

type QuizzesState = {
  quizzes: Quiz[];
  quiz: Partial<Quiz>;
};

const defaultQuiz: Quiz = {
  _id: "0",
  title: "New Quiz",
  description: "Quiz Description",
  quizType: "GRADED_QUIZ",
  points: 0,
  assignmentGroup: "Quizzes",
  shuffleAnswers: true,
  timeLimit: 20,
  multipleAttempts: false,
  attemptsAllowed: 1,
  showCorrectAnswers: "IMMEDIATELY",
  accessCode: "",
  oneQuestionAtATime: true,
  webcamRequired: false,
  lockQuestionsAfterAnswering: false,
  due: new Date().toISOString().split('T')[0],
  available: new Date().toISOString().split('T')[0],
  until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  published: false,
  questions: [],
  numQuestions: 0,
};

const initialState: QuizzesState = {
  quizzes: [],
  quiz: defaultQuiz,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action: PayloadAction<Quiz[]>) => {
      state.quizzes = action.payload.map(quiz => ({
        ...quiz,
        numQuestions: quiz.questions?.length ?? 0,
        points: quiz.questions?.reduce((sum, q) => sum + (q.points ?? 0), 0) ?? 0,
      }));
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      const newQuiz = { 
        ...action.payload, 
        numQuestions: action.payload.questions?.length ?? 0,
        points: action.payload.questions?.reduce((sum, q) => sum + (q.points ?? 0), 0) ?? 0,
      };
      state.quizzes = [...state.quizzes, newQuiz];
    },
    deleteQuiz: (state, action: PayloadAction<string>) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== action.payload);
    },
    updateQuiz: (state, action: PayloadAction<Quiz>) => {
      const updatedQuiz = {
        ...action.payload,
        numQuestions: action.payload.questions?.length ?? 0,
        points: action.payload.questions?.reduce((sum, q) => sum + (q.points ?? 0), 0) ?? 0,
      };
      state.quizzes = state.quizzes.map((q) => (q._id === updatedQuiz._id ? updatedQuiz : q));
    },
    setQuiz: (state, action: PayloadAction<Partial<Quiz>>) => {
      state.quiz = action.payload;
    },
    resetQuiz: (state) => {
      state.quiz = defaultQuiz;
    },
    togglePublished: (state, action: PayloadAction<string>) => {
      const quizId = action.payload;
      state.quizzes = state.quizzes.map(quiz => {
        if (quiz._id === quizId) {
          return { ...quiz, published: !quiz.published };
        }
        return quiz;
      });
    },
    setQuizQuestions: (state, action: PayloadAction<{ quizId: string; questions: QuizQuestion[] }>) => {
      const { quizId, questions } = action.payload;
      const quizToUpdate = state.quizzes.find(q => q._id === quizId);
      if (quizToUpdate) {
        const totalPoints = questions.reduce((sum, q) => sum + (q.points ?? 0), 0);
        quizToUpdate.questions = questions;
        quizToUpdate.numQuestions = questions.length;
        quizToUpdate.points = totalPoints;
      }
    },
  },
});

export const { 
  setQuizzes, 
  addQuiz, 
  deleteQuiz, 
  updateQuiz, 
  setQuiz, 
  resetQuiz,
  togglePublished,
  setQuizQuestions,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;