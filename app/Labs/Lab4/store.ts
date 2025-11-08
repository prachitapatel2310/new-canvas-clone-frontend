import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "./ReduxExamples/HelloRedux/helloReducer";
import counterReducer from "./ReduxExamples/CounterRedux/counterReducer";
import addReducer from "./ReduxExamples/AddRedux/addReducer";
import todosReducer from "./ReduxExamples/todos/todosReducer";

// Factory to create a fresh store instance for Lab 4
export const makeLab4Store = () =>
  configureStore({
    reducer: {
      helloReducer,
      counterReducer,
      addReducer,
      todosReducer,
    },
  });

// Infer the type of the Lab4 store factory
export type AppLab4Store = ReturnType<typeof makeLab4Store>;
// Infer the Lab4-specific RootState and AppDispatch types (renamed to avoid conflicts)
export type Lab4RootState = ReturnType<AppLab4Store["getState"]>;
export type Lab4AppDispatch = AppLab4Store["dispatch"];