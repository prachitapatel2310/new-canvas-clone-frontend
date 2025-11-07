import { configureStore } from "@reduxjs/toolkit";

import coursesReducer from "@/app/(kambaz)/Courses/reducer";
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
      accountReducer,
      assignmentsReducer,
      enrollmentsReducer,
    },
  });

// Create a fresh store on the server, and a persistent store on the client
const isClient = typeof window !== "undefined";

let store = (() => {
  if (isClient) {
    // re-use store across HMR / client navigation
    const anyGlobal = globalThis as any;
    if (!anyGlobal.__KAMBAZ_STORE__) {
      anyGlobal.__KAMBAZ_STORE__ = makeStore();
    }
    return anyGlobal.__KAMBAZ_STORE__;
  } else {
    // server: create a new store for each render
    return makeStore();
  }
})();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
