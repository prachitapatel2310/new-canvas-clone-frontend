import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import enrollmentsReducer from "./Courses/Enrollments/reducer";
import quizzesReducer from "./Courses/[cid]/Quizzes/reducer";
// Factory to create a fresh store instance
export const makeStore = () => {
  return configureStore({
    reducer: {
      coursesReducer,
      modulesReducer,
      accountReducer,
      assignmentsReducer,
      enrollmentsReducer,
      quizzesReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
