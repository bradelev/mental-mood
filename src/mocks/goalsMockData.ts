import { Goal } from '../api/goals';

export const mockGoals: Goal[] = [
  {
    user_id: "user1",
    id: "goal1",
    goal: "Aprender un nuevo idioma",
    goals: [
      {
        id: "subgoal1",
        description: "Estudiar vocabulario básico",
        status: "complete"
      },
      {
        id: "subgoal2",
        description: "Practicar conversación",
        status: "incomplete"
      }
    ]
  },
  {
    user_id: "user1",
    id: "goal2",
    goal: "Hacer ejercicio regularmente",
    goals: [
      {
        id: "subgoal3",
        description: "Correr 3 veces por semana",
        status: "incomplete"
      },
      {
        id: "subgoal4",
        description: "Hacer yoga los fines de semana",
        status: "complete"
      }
    ]
  },
  {
    user_id: "user2",
    id: "goal3",
    goal: "Leer 12 libros este año",
    goals: [
      {
        id: "subgoal5",
        description: "Leer un libro de ciencia ficción",
        status: "complete"
      },
      {
        id: "subgoal6",
        description: "Leer una biografía",
        status: "incomplete"
      }
    ]
  }
];

export const findGoalById = (id: string): Goal | undefined => {
  return mockGoals.find(goal => goal.id === id);
};

export const addGoal = (goal: Omit<Goal, 'id'>): Goal => {
  const newGoal: Goal = {
    ...goal,
    id: `goal${mockGoals.length + 1}`
  };
  mockGoals.push(newGoal);
  return newGoal;
};

export const updateGoal = (id: string, updatedGoal: Partial<Goal>): Goal | undefined => {
  const index = mockGoals.findIndex(goal => goal.id === id);
  if (index !== -1) {
    mockGoals[index] = { ...mockGoals[index], ...updatedGoal };
    return mockGoals[index];
  }
  return undefined;
};

export const deleteGoal = (id: string): boolean => {
  const index = mockGoals.findIndex(goal => goal.id === id);
  if (index !== -1) {
    mockGoals.splice(index, 1);
    return true;
  }
  return false;
};
