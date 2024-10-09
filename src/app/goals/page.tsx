"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAllGoals, Goal } from '@/api/goals';
import { Button } from '@/components/ui/Button';
import { Plus, ArrowRight, Target } from 'lucide-react';

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const fetchedGoals = await getAllGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Error al obtener las metas:', error);
      }
    };

    fetchGoals();
  }, []);

  const handleNewConversation = () => {
    router.push('/feelings');
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Mis Metas</h1>
        
        <Button 
          onClick={handleNewConversation}
          className="mb-8 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Iniciar nueva conversación
        </Button>
        
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/goals/${goal.id}`}>
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300 ease-in-out">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="text-blue-500 mr-3" size={24} />
                      <h2 className="text-xl font-semibold text-gray-800">{goal.title}</h2>
                    </div>
                    <ArrowRight className="text-gray-400" size={20} />
                  </div>
                  <p className="mt-2 text-gray-600">
                    {goal.goals.length} subtareas | {goal.goals.filter(t => t.status === 'complete').length} completadas
                  </p>
                  <div className="mt-4 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 rounded-full h-2" 
                      style={{ width: `${(goal.goals.filter(t => t.status === 'complete').length / goal.goals.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {goals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Aún no tienes metas. ¡Comienza una nueva conversación para crear tus primeras metas!</p>
            <Button 
              onClick={handleNewConversation}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Crear mi primera meta
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Goals;
