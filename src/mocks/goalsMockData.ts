import { Goal } from '../api/goals';

export const mockGoals: Goal[] = [
  {
      "id": 39,
      "goal": "Triathlon Preparation Action List",
      "user_id": "pepe@arionkoder.com",
      "parent": null,
      "status": 0,
      "goals": [
          {
              "id": 40,
              "goal": "Assess your current fitness level and set a timeline for your triathlon.",
              "user_id": "pepe@arionkoder.com",
              "parent": 39,
              "status": 0
          },
          {
              "id": 41,
              "goal": "Create a weekly training schedule that includes swimming, biking, and running.",
              "user_id": "pepe@arionkoder.com",
              "parent": 39,
              "status": 0
          },
          {
              "id": 42,
              "goal": "Set specific goals for each discipline (e.g., distance, duration, technique).",
              "user_id": "pepe@arionkoder.com",
              "parent": 39,
              "status": 0
          },
          {
              "id": 43,
              "goal": "Incorporate strength training and flexibility exercises into your routine.",
              "user_id": "pepe@arionkoder.com",
              "parent": 39,
              "status": 0
          },
          {
              "id": 44,
              "goal": "Plan your nutrition strategy for training and race day.",
              "user_id": "pepe@arionkoder.com",
              "parent": 39,
              "status": 0
          },
          {
              "id": 45,
              "goal": "Schedule regular check-ins to track your progress and adjust the plan as needed.",
              "user_id": "pepe@arionkoder.com",
              "parent": 39,
              "status": 0
          }
      ]
  },
  {
      "id": 51,
      "goal": "Meal Plan Preparation Tasks",
      "user_id": "pepe@arionkoder.com",
      "parent": null,
      "status": 0,
      "goals": [
          {
              "id": 52,
              "goal": "List favorite healthy foods",
              "user_id": "pepe@arionkoder.com",
              "parent": 51,
              "status": 0
          },
          {
              "id": 53,
              "goal": "Plan meals for 5 days",
              "user_id": "pepe@arionkoder.com",
              "parent": 51,
              "status": 0
          },
          {
              "id": 54,
              "goal": "Include snacks and hydration",
              "user_id": "pepe@arionkoder.com",
              "parent": 51,
              "status": 0
          },
          {
              "id": 55,
              "goal": "Prep meals in advance",
              "user_id": "pepe@arionkoder.com",
              "parent": 51,
              "status": 0
          }
      ]
  }
];

export const findGoalById = (id: number): Goal | undefined => {
  return mockGoals.find(goal => goal.id === id);
};

export const addGoal = (goal: Omit<Goal, 'id'>): Goal => {
  const newGoal: Goal = {
    ...goal,
    id: mockGoals.length + 1
  };
  mockGoals.push(newGoal);
  return newGoal;
};

export const updateGoal = (id: number, updatedGoal: Partial<Goal>): Goal | undefined => {
  const index = mockGoals.findIndex(goal => goal.id === id);
  if (index !== -1) {
    mockGoals[index] = { ...mockGoals[index], ...updatedGoal };
    return mockGoals[index];
  }
  return undefined;
};

export const deleteGoal = (id: number): boolean => {
  const index = mockGoals.findIndex(goal => goal.id === id);
  if (index !== -1) {
    mockGoals.splice(index, 1);
    return true;
  }
  return false;
};
