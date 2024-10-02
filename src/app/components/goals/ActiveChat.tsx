"use client"

import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Task {
  id: number;
  description: string;
  dueDate: Date;
  completed: boolean;
}

interface ActiveChatProps {
  id: string;
}

const ActiveChat = ({ id }: ActiveChatProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (id) {
      // Aquí deberías hacer la llamada a tu API para obtener las tareas
      // Por ahora, usaremos datos de ejemplo
      const mockTasks: Task[] = [
        { id: 1, description: 'Tarea 1', dueDate: new Date(Date.now() + 86400000), completed: false },
        { id: 2, description: 'Tarea 2', dueDate: new Date(Date.now() + 172800000), completed: true },
      ];
      setTasks(mockTasks);
    }
  }, [id]);

  const updateTask = (taskId: number, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const allTasksCompleted = tasks.every(task => task.completed);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chat {id}</h1>
      <p className="mb-4">Estado: {allTasksCompleted ? 'Completado' : 'En progreso'}</p>
      {tasks.map(task => (
        <div key={task.id} className="border p-4 mb-4 rounded">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={(e) => updateTask(task.id, { completed: e.target.checked })}
            className="mr-2"
          />
          <input
            value={task.description}
            onChange={(e) => updateTask(task.id, { description: e.target.value })}
            className="mb-2 p-1 border rounded"
          />
          <input
            type="date"
            value={task.dueDate.toISOString().split('T')[0]}
            onChange={(e) => updateTask(task.id, { dueDate: new Date(e.target.value) })}
            className="mb-2 p-1 border rounded"
          />
          <p>Vence: {formatDistanceToNow(task.dueDate, { addSuffix: true, locale: es })}</p>
          <button onClick={() => deleteTask(task.id)} className="mt-2 p-1 bg-red-500 text-white rounded">
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActiveChat;
