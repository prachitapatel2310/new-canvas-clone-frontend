// app/Courses/[cid]/Quizzes/[qid]/editor/QuizEditorContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Quiz } from "../../../Quizzes/reducer";

interface QuizEditorContextType {
  saveHandler: ((publish: boolean) => Promise<Quiz | null>) | null;
  setSaveHandler: (handler: (publish: boolean) => Promise<Quiz | null>) => void;
}

const QuizEditorContext = createContext<QuizEditorContextType>({
  saveHandler: null,
  setSaveHandler: () => {},
});

export const useQuizEditor = () => useContext(QuizEditorContext);

export function QuizEditorProvider({ children }: { children: ReactNode }) {
  const [saveHandler, setSaveHandler] = useState<((publish: boolean) => Promise<Quiz | null>) | null>(null);

  return (
    <QuizEditorContext.Provider value={{ 
      saveHandler, 
      setSaveHandler: (h) => setSaveHandler(() => h) 
    }}>
      {children}
    </QuizEditorContext.Provider>
  );
}