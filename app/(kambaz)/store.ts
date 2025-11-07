import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/[cid]/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import enrollmentsReducer from "./Courses/Enrollments/reducer";

// Factory to create a fresh store instance
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

// On the client, reuse a single store instance to preserve state across navigations.
// On the server, create a new store instance for each request.
const isClient = typeof window !== "undefined";
let store = isClient ? (globalThis as any).__KAMBAZ_STORE__ : undefined;
if (!store) {
  store = makeStore();
  if (isClient) (globalThis as any).__KAMBAZ_STORE__ = store;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

