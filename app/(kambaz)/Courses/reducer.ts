import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
const initialState = {
  courses: [], // Initial state should be empty
  course: {
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    image: "/images/reactjs.jpg",
    description: "New Description",
  },
};
const coursesSlice = createSlice({
 name: "courses",
 initialState,
 reducers: {
   addNewCourse: (state, { payload: course }) => {
     const newCourse = { ...course, _id: uuidv4() };
     state.courses = [...state.courses, newCourse] as any;
   },
   deleteCourse: (state, { payload: courseId }) => {
     state.courses = state.courses.filter(
       (course: any) => course._id !== courseId
     );
   },
   updateCourse: (state, { payload: course }) => {
     state.courses = state.courses.map((c: any) =>
       c._id === course._id ? course : c
     ) as any;
   },
   setCourses: (state, { payload: courses }) => {
     state.courses = courses;
   },
 },
});
export const { addNewCourse, deleteCourse, updateCourse, setCourses } =
  coursesSlice.actions;
export default coursesSlice.reducer;

