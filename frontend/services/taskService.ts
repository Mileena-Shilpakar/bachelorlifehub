import axios from 'axios';
import apiClient from './apiClient';

const BASE_URL = 'http://127.0.0.1:8000/api/task';

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Task API calls
export const getTasks = async () => {
  try {
    const response = await apiClient.get('/task/tasks/');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const createTask = async (taskData: any) => {
  try {
    const response = await apiClient.post('/task/tasks/', taskData);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (taskId: string, updatedData: any) => {
  try {
    const response = await apiClient.put(`/task/tasks/${taskId}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
    const response = await apiClient.delete(`/task/tasks/${taskId}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Timer API calls
export const startTimerSession = async (taskId: string) => {
  try {
    const response = await apiClient.post(`/task/tasks/${taskId}/start-timer-session/`);
    return response.data;
  } catch (error) {
    console.error('Error starting timer session:', error);
    throw error;
  }
};

export const saveTimerSession = async (sessionId: string) => {
  try {
    const response = await apiClient.post(`/task/tasks/save-timer-session/${sessionId}/`);
    return response.data;
  } catch (error) {
    console.error('Error saving timer session:', error);
    throw error;
  }
};

export const cancelTimerSession = async (sessionId: string) => {
  try {
    const response = await apiClient.delete(`/task/tasks/cancel-timer-session/${sessionId}/`);
    return response.data;
  } catch (error) {
    console.error('Error canceling timer session:', error);
    throw error;
  }
};

// Update time spent on a task
export const updateTimeSpent = async (taskId: string, timeSpent: string) => {
  try {
    const response = await apiClient.post(`/task/tasks/${taskId}/spent-time/`, { time_spent: timeSpent });
    return response.data;
  } catch (error) {
    console.error('Error updating time spent:', error);
    throw error;
  }
};
