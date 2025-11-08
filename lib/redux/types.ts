// Lightweight types-only module. Import this from server components to avoid
// importing the runtime store or reducer modules during prerender.
export type CoursesState = any;
export type AccountState = any;
export type AssignmentsState = any;
export type EnrollmentsState = any;

export type RootState = {
  coursesReducer: CoursesState;
  accountReducer: AccountState;
  assignmentsReducer: AssignmentsState;
  enrollmentsReducer: EnrollmentsState;
  // add other slices here as needed (keep `any` here to avoid importing slices)
};

export type AppDispatch = (...args: any[]) => any;
