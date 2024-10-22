import axios from 'axios';
import { mockGoals, findGoalById, addGoal, updateGoal as updateMockGoal, deleteGoal as deleteMockGoal } from '../mocks/goalsMockData';

export interface Goal {
  user_id: string;
  id: string;
  goal: string;
  goals?: {
    id: string;
    description: string;
    status: 'complete' | 'incomplete';
  }[];
  // Añade aquí otras propiedades que pueda tener el objeto Goal
}

const API_BASE_URL = "http://ec2-54-92-209-40.compute-1.amazonaws.com";
const USE_MOCK_DATA = false;

export const getAllGoals = async (): Promise<Goal[]> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(mockGoals);
  }
  try {
    const user_id = "pepe@arionkoder.com"; // Reemplaza esto con el ID de usuario real o obténlo de alguna manera
    const response = await axios.get(`${API_BASE_URL}/goals/${user_id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las metas:', error);
    throw error;
  }
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
