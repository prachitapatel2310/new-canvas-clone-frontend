import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// You don't import dbEnrollments here

type Enrollment = {
  _id?: string;
  user: string;
  course: string;
};

type EnrollmentsState = {
  enrollments: Enrollment[];
};

// The initial state should be empty.
// It will be populated by fetching from the server.
const initialState: EnrollmentsState = {
  enrollments: [],
};

const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    // This reducer is fine. It will be called AFTER a successful API call.
    enrollUser: (state, action: PayloadAction<{ user: string; course: string }>) => {
      const { user, course } = action.payload;
      const exists = state.enrollments.some((en) => en.user === user && en.course === course);
      if (!exists) {
        state.enrollments = [...state.enrollments, { _id: Date.now().toString(), user, course }];
      }
    },
    // This reducer is also fine.
    unenrollUser: (state, action: PayloadAction<{ user: string; course: string }>) => {
      const { user, course } = action.payload;
      state.enrollments = state.enrollments.filter((en) => !(en.user === user && en.course === course));
    },
    // This is used to load the enrollments from the server
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.enrollments = action.payload;
    },
  },
});

export const { enrollUser, unenrollUser, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;