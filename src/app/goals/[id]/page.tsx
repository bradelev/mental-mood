"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getGoalById, updateGoal, Goal } from '@/api/goals';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Edit, Trash, Check, X } from 'lucide-react';

const GoalDetail = ({ params }: { params: { id: string } }) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  useEffect(() => {
    const fetchGoal = async () => {
      const fetchedGoal = await getGoalById(params.id);
      if (fetchedGoal) {
        setGoal(fetchedGoal);
      }
    };
    fetchGoal();
  }, [params.id]);

  const handleTaskEdit = async (taskId: string, newDescription: string) => {
    if (goal) {
      const updatedTasks = goal.goals.map(task => 
        task.id === taskId ? { ...task, description: newDescription } : task
      );
      try {
        const updatedGoal = await updateGoal(goal.id, { 
          goals: updatedTasks.map(task => ({
            ...task,
            status: task.status as "pending" | "complete" | "deleted"
          }))
        });
        if (updatedGoal) {
          setGoal(updatedGoal);
        }
        setEditingTaskId(null);
      } catch (error) {
        console.error('Error al editar la tarea:', error);
      }
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    if (goal) {
      const updatedTasks = goal.goals.filter(task => task.id !== taskId);
      try {
        const updatedGoal = await updateGoal(goal.id, { goals: updatedTasks });
        if (updatedGoal) {
          setGoal(updatedGoal);
        }
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
      }
    }
  };

  const handleTaskStatusToggle = async (taskId: string) => {
    if (goal) {
      const updatedTasks = goal.goals.map(task => 
        task.id === taskId ? { ...task, status: task.status === 'complete' ? 'pending' : 'complete' } : task
      );
      try {
        const updatedGoal = await updateGoal(goal.id, { 
          goals: updatedTasks.map(task => ({
            ...task,
            status: task.status as "pending" | "complete" | "deleted"
          }))
        });
        if (updatedGoal) {
          setGoal(updatedGoal);
        }
      } catch (error) {
        console.error('Error al cambiar el estado de la tarea:', error);
      }
    }
  };

  if (!goal) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 max-w-4xl"
    >
      <Link href="/goals">
        <Button className="mb-4 flex items-center text-blue-500 hover:text-white hover:bg-blue-600 transition-colors duration-300">
          <ArrowLeft size={20} className="mr-2" />
          Volver a Metas
        </Button>
      </Link>
      
      <h1 className="text-3xl font-bold mb-6 text-blue-600">{goal.title}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Subtareas</h2>
        {goal.goals.map((task) => (
          <motion.div 
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-3 border-b last:border-b-0"
          >
            {editingTaskId === task.id ? (
              <Textarea
                value={editedTaskDescription}
                onChange={(e) => setEditedTaskDescription(e.target.value)}
                className="flex-grow mr-2"
              />
            ) : (
              <div className="flex items-center flex-grow">
                <input
                  type="checkbox"
                  checked={task.status === 'complete'}
                  onChange={() => handleTaskStatusToggle(task.id)}
                  className="mr-3"
                />
                <span className={task.status === 'complete' ? 'line-through text-gray-500' : ''}>
                  {task.description}
                </span>
              </div>
            )}
            <div className="flex items-center">
              {editingTaskId === task.id ? (
                <>
                  <Button
                    onClick={() => handleTaskEdit(task.id, editedTaskDescription)}
                    className="mr-2 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Check size={20} />
                  </Button>
                  <Button
                    onClick={() => setEditingTaskId(null)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <X size={20} />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditedTaskDescription(task.description);
                    }}
                    className="mr-2 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Edit size={20} />
                  </Button>
                  <Button
                    onClick={() => handleTaskDelete(task.id)}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <Trash size={20} />
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default GoalDetail;