import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  count: 0,
};
const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count = state.count + 1;
      // debug: log when reducer runs
      try { console.log("counterReducer increment ->", state.count); } catch (e) {}
    },
    decrement: (state) => {
      state.count = state.count - 1;
      // debug: log when reducer runs
      try { console.log("counterReducer decrement ->", state.count); } catch (e) {}
    },
  },
});
export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;