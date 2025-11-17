import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Assignment = any;
interface AssignmentsState {
  assignments: Assignment[];
}

const initialState: AssignmentsState = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },
    addAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments = [...state.assignments, action.payload];
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === action.payload._id ? action.payload : a
      );
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.filter((a: any) => a._id !== action.payload);
    },
    editAssignment: (state, action: PayloadAction<string>) => {
      state.assignments = state.assignments.map((a: any) =>
        a._id === action.payload ? { ...a, editing: true } : a
      );
    },
  },
});

export const { setAssignments, addAssignment, updateAssignment, deleteAssignment, editAssignment } =
  assignmentsSlice.actions;
export default assignmentsSlice.reducer;
