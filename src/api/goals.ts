import axios from 'axios';
import { mockGoals, findGoalById, addGoal, updateGoal as updateMockGoal, deleteGoal as deleteMockGoal } from '../mocks/goalsMockData';

export interface Goal {
  userId: string;
  id: string;
  title: string;
  goals: {
    id: string;
    description: string;
    status: 'pending' | 'complete' | 'deleted';
  }[];
  status: 'pending' | 'complete' | 'deleted';
}

const API_BASE_URL = 'https://tu-api-base-url.com';
const USE_MOCK_DATA = true; // Cambia esto a false cuando quieras usar la API real

// Obtener todas las metas
export const getAllGoals = async (): Promise<Goal[]> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockGoals);
  }
  const response = await axios.get(`${API_BASE_URL}/goals`);
  return response.data;
};

// Obtener una meta por ID
export const getGoalById = async (id: string): Promise<Goal | undefined> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(findGoalById(id));
  }
  const response = await axios.get(`${API_BASE_URL}/goals/${id}`);
  return response.data;
};

// Crear una nueva meta
export const createGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(addGoal(goal));
  }
  const response = await axios.post(`${API_BASE_URL}/goals`, goal);
  return response.data;
};

// Actualizar una meta existente
export const updateGoal = async (id: string, goal: Partial<Goal>): Promise<Goal | undefined> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(updateMockGoal(id, goal));
  }
  const response = await axios.put(`${API_BASE_URL}/goals/${id}`, goal);
  return response.data;
};

// Eliminar una meta (opcional, ya que mencionaste un estado 'deleted')
export const deleteGoal = async (id: string): Promise<boolean> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(deleteMockGoal(id));
  }
  await axios.delete(`${API_BASE_URL}/goals/${id}`);
  return true;
};
