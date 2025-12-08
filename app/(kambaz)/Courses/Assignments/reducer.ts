import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// DO NOT import from the server database

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
  assignment: Partial<Assignment>;
};

const initialState: AssignmentsState = {
  assignments: [], // start empty; will be populated from API via setAssignments
  assignment: {
    _id: "",
    title: "",
    description: "",
    course: "",
    due: null,
    available: null,
    until: null,
    maxPoints: 100,
  },
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    // Populate assignments after fetching from server
    setAssignments: (state, action: PayloadAction<Assignment[]>) => {
      state.assignments = action.payload;
    },

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
  },
});

export const { setAssignments, addAssignment, deleteAssignment, updateAssignment } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
