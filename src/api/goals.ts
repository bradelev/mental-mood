import axios from 'axios';
import { mockGoals, findGoalById, addGoal, updateGoal as updateMockGoal, deleteGoal as deleteMockGoal } from '../mocks/goalsMockData';

export enum Status {
  INCOMPLETE = 0,
  COMPLETE = 1,
}

export interface Task {
  id: number;
  goal: string;
  user_id: string;
  parent?: number | null;
  status?: Status;
};

export interface Goal {
  user_id: string;
  id: number;
  parent?: number | null;
  goal: string;
  status?: Status;
  goals: Task[];
}

const API_BASE_URL = "https://bytebusters.arionkoder.com";
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
export const getGoalById = async (id: number): Promise<Goal | undefined> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(findGoalById(id));
  }
  const user_id = localStorage.getItem('username') || '';
  const response = await axios.get(`${API_BASE_URL}/goals/${user_id}`);
  const goal = response.data?.find((goal: Goal) => goal.id === id);
  return goal;
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
export const updateGoal = async (id: number, goal: Partial<Goal>): Promise<Goal | undefined> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(updateMockGoal(id, goal));
  }
  const payload = {
    ...goal,
    goals: goal.goals?.map(task => task.goal)
  };
  const response = await axios.put(`${API_BASE_URL}/goals/${id}`, payload);
  const updatedGoal = {
    ...response.data,
    id,
    goals: response.data.goals.map((task: string, index: number) => ({
      goal: task,
      id: goal.goals?.[index]?.id || 0,
      status: goal.goals?.[index]?.status || 0,
    }))
  };
  console.log(updatedGoal);
  return updatedGoal;
};

// Eliminar una meta (opcional, ya que mencionaste un estado 'deleted')
export const deleteGoal = async (id: number): Promise<boolean> => {
  if (USE_MOCK_DATA) {
    return Promise.resolve(deleteMockGoal(id));
  }
  await axios.delete(`${API_BASE_URL}/goals/${id}`);
  return true;
};
