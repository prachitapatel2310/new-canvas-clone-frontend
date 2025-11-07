import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "@/app/(kambaz)/Courses/reducer";
import modulesReducer from "@/app/(kambaz)/Courses/[cid]/Modules/reducer";
import accountReducer from "@/app/(kambaz)/Account/reducer";
import assignmentsReducer from "@/app/(kambaz)/Courses/Assignments/reducer";
import enrollmentsReducer from "@/app/(kambaz)/Courses/Enrollments/reducer";

// Create a client-side store instance. This module is intended to be imported
// only from client components (the provider). Keeping it under /lib reduces
// the chance Next's server bundler will try to evaluate it during prerender.
export const makeStore = () =>
  configureStore({
    reducer: {
      coursesReducer,
      modulesReducer,
      accountReducer,
      assignmentsReducer,
      enrollmentsReducer,
    },
  });

// Single client instance for runtime
const store = makeStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
