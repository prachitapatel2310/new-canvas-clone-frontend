// app/Courses/Quizzes/client.ts
import axios from "axios";
import { Quiz } from "./reducer";
/* eslint-disable @typescript-eslint/no-explicit-any */


const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const QUIZZES_API = `${HTTP_SERVER}/api/quizzes`;

// Quiz CRUD Operations
export const findQuizzesForCourse = async (courseId: string): Promise<Quiz[]> => {
  const res = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/quizzes`);
  return res.data;
};

export const createQuizForCourse = async (courseId: string, quiz: Partial<Quiz>): Promise<Quiz> => {
  const res = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/quizzes`, quiz);
  return res.data;
};

export const findQuizById = async (quizId: string): Promise<Quiz> => {
  const res = await axiosWithCredentials.get(`${QUIZZES_API}/${quizId}`);
  return res.data;
};

export const updateQuiz = async (quiz: Quiz): Promise<Quiz> => {
  const res = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
  return res.data;
};

export const deleteQuiz = async (quizId: string) => {
  const res = await axiosWithCredentials.delete(`${QUIZZES_API}/${quizId}`);
  return res.data;
};

export const toggleQuizPublished = async (quizId: string, published: boolean) => {
  const res = await axiosWithCredentials.put(`${QUIZZES_API}/${quizId}/publish`, { isPublished: published });
  return res.data;
};

// Add this to your client.ts file if not already there:
export const submitQuiz = async (quizId: string, submission: any) => {
  try {
    const res = await axiosWithCredentials.post(`${QUIZZES_API}/${quizId}/submit`, submission);
    return res.data;
  } catch (error) {
    console.error("Submit quiz error:", error);
    throw error;
  }

};