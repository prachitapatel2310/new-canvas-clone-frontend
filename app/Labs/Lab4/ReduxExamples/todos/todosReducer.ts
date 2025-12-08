import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  todos: [
    { id: "1", title: "Learn React", done: false },
    { id: "2", title: "Learn Node", done: false },
  ],
  todo: { id: "-1", title: "Learn Mongo", done: false },
};
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodos = [
        ...state.todos,
        { ...action.payload, id: new Date().getTime().toString(), done: false },
      ];
      state.todos = newTodos;
      state.todo = { id: "-1", title: "", done: false };
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    updateTodo: (state, action) => {
      state.todos = state.todos.map((item) =>
        item.id === action.payload.id ? { ...item, title: action.payload.title } : item
      );
      state.todo = { id: "-1", title: "", done: false };
    },
    setTodo: (state, action) => {
      state.todo = action.payload;
    },
    toggleTodoDone: (state, action) => {
      state.todos = state.todos.map((t) =>
        t.id === action.payload ? { ...t, done: !t.done } : t
      );
      if (state.todo.id === action.payload) {
        state.todo = { ...state.todo, done: !state.todo.done };
      }
    },
  },
});
export const { addTodo, deleteTodo, updateTodo, setTodo, toggleTodoDone } = todosSlice.actions;
export default todosSlice.reducer;
