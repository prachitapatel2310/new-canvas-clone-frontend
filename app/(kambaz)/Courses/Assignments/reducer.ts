import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { assignments } from "../../../../../kambaz-node-server-app/Kambaz/Database";

type Assignment = {
  _id: string;
  title: string;
  description?: string;
  course?: string;
  due?: string | null;
  available?: string | null;
  until?: string | null;
  maxPoints?: number;
};

type AssignmentsState = {
  assignments: Assignment[];
};

const initialState: AssignmentsState = {
  assignments: (assignments as any[]).map((a) => ({
    _id: (a._id as string) ?? (a.id as string) ?? new Date().getTime().toString(),
    title: a.title,
    description: a.description,
    course: a.course,
    due: a.due ?? null,
    available: a.available ?? null,
    until: a.until ?? null,
    maxPoints: a.maxPoints ?? 100,
  })),
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, action: PayloadAction<Omit<Assignment, "_id">>) => {
      const assignment = action.payload;
      const newAssignment: Assignment = {
        _id: new Date().getTime().toString(),
        title: assignment.title,
        description: assignment.description || "",
        course: assignment.course,
        due: assignment.due ?? null,
        available: assignment.available ?? null,
        until: assignment.until ?? null,
        maxPoints: assignment.maxPoints ?? 100,
      };
      state.assignments = [...state.assignments, newAssignment];
    },
    deleteAssignment: (state, action: PayloadAction<string>) => {
      const assignmentId = action.payload;
      state.assignments = state.assignments.filter((a) => a._id !== assignmentId);
    },
    updateAssignment: (state, action: PayloadAction<Assignment>) => {
      const assignment = action.payload;
      state.assignments = state.assignments.map((a) => (a._id === assignment._id ? assignment : a));
    },
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },
  },
});

export const { addAssignment, deleteAssignment, updateAssignment, setAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
