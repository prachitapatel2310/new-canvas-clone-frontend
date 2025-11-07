import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "./ReduxExamples/HelloRedux/helloReducer";
import counterReducer from "./ReduxExamples/CounterRedux/counterReducer";
import addReducer from "./ReduxExamples/AddRedux/addReducer";
import todosReducer from "./ReduxExamples/todos/todosReducer";

// Factory to create a fresh store instance for Lab 4
export const makeLab4Store = () => {
  return configureStore({
    reducer: {
      helloReducer,
      counterReducer,
      addReducer,
      todosReducer,
    },
  });
};

// Infer the type of makeStore
export type AppLab4Store = ReturnType<typeof makeLab4Store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppLab4Store['getState']>;
export type AppDispatch = AppLab4Store['dispatch'];