import axios from "axios";

// Create axios instance with credentials
const axiosWithCredentials = axios.create({ withCredentials: true });

const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

console.log('=== ASSIGNMENTS CLIENT CONFIG ===');
console.log('HTTP_SERVER:', HTTP_SERVER);
console.log('COURSES_API:', COURSES_API);
console.log('ASSIGNMENTS_API:', ASSIGNMENTS_API);

export const findAssignmentsForCourse = async (courseId: string) => {
  console.log('\n=== FRONTEND: Fetching Assignments ===');
  console.log('Course ID:', courseId);
  console.log('Request URL:', `${COURSES_API}/${courseId}/assignments`);
  
  try {
    const res = await axiosWithCredentials.get(`${COURSES_API}/${courseId}/assignments`);
    
    console.log('Response Status:', res.status);
    console.log('Response Data:', res.data);
    console.log('Data Type:', typeof res.data);
    console.log('Is Array:', Array.isArray(res.data));
    console.log('Data Length:', res.data?.length);
    
    if (res.data && res.data.length > 0) {
      console.log('First Assignment:', res.data[0]);
      console.log('Assignment IDs:', res.data.map((a: any) => a._id));
      console.log('Assignment Titles:', res.data.map((a: any) => a.title));
    } else {
      console.log('No assignments returned!');
    }
    
    return res.data;
  } catch (error: any) {
    console.error('=== FRONTEND ERROR ===');
    console.error('Error Message:', error.message);
    console.error('Error Status:', error.response?.status);
    console.error('Error Data:', error.response?.data);
    throw error;
  }
};

export const createAssignmentForCourse = async (courseId: string, assignment: any) => {
  console.log('\n=== FRONTEND: Creating Assignment ===');
  console.log('Course ID:', courseId);
  console.log('Assignment Data:', assignment);
  
  try {
    const res = await axiosWithCredentials.post(`${COURSES_API}/${courseId}/assignments`, assignment);
    
    console.log('Created Assignment:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Create Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateAssignment = async (assignment: any) => {
  console.log('\n=== FRONTEND: Updating Assignment ===');
  console.log('Assignment ID:', assignment._id);
  console.log('Update Data:', assignment);
  
  try {
    const res = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
    
    console.log('Updated Assignment:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Update Error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteAssignment = async (assignmentId: string) => {
  console.log('\n=== FRONTEND: Deleting Assignment ===');
  console.log('Assignment ID:', assignmentId);
  
  try {
    const res = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
    
    console.log('Delete Response:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('Delete Error:', error.response?.data || error.message);
    throw error;
  }
};