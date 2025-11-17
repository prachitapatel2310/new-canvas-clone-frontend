import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// remove Database dependency and start with empty modules array
const initialState = {
  modules: [],
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    // new: set modules from server
    setModules: (state, { payload }: any) => {
      state.modules = payload;
    },

    addModule: (state, { payload: module }: any) => {
      const newModule: any = {
        id: uuidv4(), // Reducer creates the ID
        lessons: [],  // Reducer creates empty lessons array
        name: module.name,
        course: module.course,
      };
      state.modules = [...state.modules, newModule] as any;
    },
    deleteModule: (state, { payload: moduleId }: any) => {
      // Filters modules based on the correct 'id' property
      state.modules = state.modules.filter((m: any) => m.id !== moduleId);
    },
    updateModule: (state, { payload: module }: any) => {
      // Updates module based on the correct 'id' property
      state.modules = state.modules.map((m: any) => (m.id === module.id ? module : m)) as any;
    },
    editModule: (state, { payload: moduleId }: any) => {
      // Edits module based on the correct 'id' property
      state.modules = state.modules.map((m: any) => (m.id === moduleId ? { ...m, editing: true } : m)) as any;
    },
    
    // ACTION TO DELETE A SPECIFIC LESSON
    deleteLesson: (state, { payload: { moduleId, lessonId } }: any) => {
      state.modules = state.modules.map((m: any) => {
        if (m.id === moduleId) {
          // Found the module, now filter out the lesson by its 'id'
          const newLessons = m.lessons.filter((l: any) => l.id !== lessonId);
          return { ...m, lessons: newLessons };
        }
        return m;
      }) as any;
    },
  },
});

// include setModules in exported actions
export const { addModule, deleteModule, updateModule, editModule, deleteLesson, setModules } = modulesSlice.actions;
export default modulesSlice.reducer;