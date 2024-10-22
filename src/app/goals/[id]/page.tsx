"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getGoalById, updateGoal, deleteGoal, Goal } from '@/api/goals';
import { List, Typography, Button, Input, Popconfirm, message, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const GoalDetail = ({ params }: { params: { id: string } }) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const fetchedGoal = await getGoalById(params.id);
        if (fetchedGoal) {
          setGoal(fetchedGoal);
          setEditedTitle(fetchedGoal.title);
        }
      } catch (error) {
        console.error('Error al cargar la meta:', error);
        message.error('Error al cargar la meta');
      }
    };
    fetchGoal();
  }, [params.id]);

  const handleEditTitle = () => {
    setIsEditing(true);
  };

  const handleSaveTitle = async () => {
    if (goal && editedTitle.trim()) {
      try {
        const updatedGoal = await updateGoal(goal.id, { title: editedTitle.trim() });
        if (updatedGoal) {
          setGoal(updatedGoal);
          setIsEditing(false);
          message.success('Título de la meta actualizado con éxito');
        }
      } catch (error) {
        console.error('Error al actualizar el título de la meta:', error);
        message.error('Error al actualizar el título de la meta');
      }
    }
  };

  const handleDeleteGoal = async () => {
    if (goal) {
      try {
        await deleteGoal(goal.id);
        message.success('Meta eliminada con éxito');
        router.push('/goals');
      } catch (error) {
        console.error('Error al eliminar la meta:', error);
        message.error('Error al eliminar la meta');
      }
    }
  };

  const handleAddTask = async () => {
    if (goal && newTaskDescription.trim()) {
      const newTask = {
        id: Date.now().toString(),
        description: newTaskDescription.trim(),
        status: 'pending' as const
      };
      const updatedTasks = [...goal.goals, newTask];
      try {
        const updatedGoal = await updateGoal(goal.id, { goals: updatedTasks });
        if (updatedGoal) {
          setGoal(updatedGoal);
          setNewTaskDescription('');
          message.success('Nueva subtarea agregada con éxito');
        }
      } catch (error) {
        console.error('Error al agregar la nueva subtarea:', error);
        message.error('Error al agregar la nueva subtarea');
      }
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (goal) {
      const updatedTasks = goal.goals.map(task => 
        task.id === taskId ? { ...task, status: task.status === 'complete' ? 'pending' as const : 'complete' as const } : task
      );
      try {
        const updatedGoal = await updateGoal(goal.id, { goals: updatedTasks });
        if (updatedGoal) {
          setGoal(updatedGoal);
          message.success('Estado de la subtarea actualizado con éxito');
        }
      } catch (error) {
        console.error('Error al actualizar el estado de la subtarea:', error);
        message.error('Error al actualizar el estado de la subtarea');
      }
    }
  };

  const handleEditTask = (taskId: string, description: string) => {
    setEditingTaskId(taskId);
    setEditedTaskDescription(description);
  };

  const handleSaveTask = async () => {
    if (goal && editingTaskId && editedTaskDescription.trim()) {
      const updatedTasks = goal.goals.map(task =>
        task.id === editingTaskId ? { ...task, description: editedTaskDescription.trim() } : task
      );
      try {
        const updatedGoal = await updateGoal(goal.id, { goals: updatedTasks });
        if (updatedGoal) {
          setGoal(updatedGoal);
          setEditingTaskId(null);
          setEditedTaskDescription('');
          message.success('Subtarea actualizada con éxito');
        }
      } catch (error) {
        console.error('Error al actualizar la subtarea:', error);
        message.error('Error al actualizar la subtarea');
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (goal) {
      const updatedTasks = goal.goals.filter(task => task.id !== taskId);
      try {
        const updatedGoal = await updateGoal(goal.id, { goals: updatedTasks });
        if (updatedGoal) {
          setGoal(updatedGoal);
          message.success('Subtarea eliminada con éxito');
        }
      } catch (error) {
        console.error('Error al eliminar la subtarea:', error);
        message.error('Error al eliminar la subtarea');
      }
    }
  };

  if (!goal) {
    return <div>Cargando...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <Link href="/goals" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeftOutlined style={{ marginRight: 8 }} />
        Volver a la lista de metas
      </Link>

      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <Input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onPressEnter={handleSaveTitle}
            style={{ width: '70%' }}
          />
        ) : (
          <Title level={2}>{goal.title}</Title>
        )}
        <div>
          {isEditing ? (
            <Button icon={<SaveOutlined />} onClick={handleSaveTitle} type="primary">
              Guardar
            </Button>
          ) : (
            <Button icon={<EditOutlined />} onClick={handleEditTitle}>
              Editar
            </Button>
          )}
          <Popconfirm
            title="¿Estás seguro de que quieres eliminar esta meta?"
            onConfirm={handleDeleteGoal}
            okText="Sí"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger style={{ marginLeft: 8 }}>
              Eliminar
            </Button>
          </Popconfirm>
        </div>
      </div>

      <List
        className="bg-gray-50 rounded-lg p-4 mb-4"
        header={<Title level={4}>Subtareas</Title>}
        dataSource={goal.goals}
        renderItem={(task) => (
          <List.Item
            key={task.id}
            actions={[
              editingTaskId === task.id ? (
                <Button key="edit" icon={<SaveOutlined />} onClick={handleSaveTask} type="link">
                  Guardar
                </Button>
              ) : (
                <Button key="edit" icon={<EditOutlined />} onClick={() => handleEditTask(task.id, task.description)} type="link">
                  Editar
                </Button>
              ),
              <Popconfirm
                key="delete"
                title="¿Estás seguro de que quieres eliminar esta subtarea?"
                onConfirm={() => handleDeleteTask(task.id)}
                okText="Sí"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} type="link" danger>
                  Eliminar
                </Button>
              </Popconfirm>
            ]}
          >
            <Checkbox
              checked={task.status === 'complete'}
              onChange={() => handleToggleTask(task.id)}
            >
              {editingTaskId === task.id ? (
                <Input
                  value={editedTaskDescription}
                  onChange={(e) => setEditedTaskDescription(e.target.value)}
                  onPressEnter={handleSaveTask}
                  style={{ width: '100%' }}
                />
              ) : (
                <Typography.Text style={{ textDecoration: task.status === 'complete' ? 'line-through' : 'none' }}>
                  {task.description}
                </Typography.Text>
              )}
            </Checkbox>
          </List.Item>
        )}
        locale={{ emptyText: 'No hay subtareas' }}
      />

      <div className="flex items-center">
        <Input
          placeholder="Nueva subtarea"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          onPressEnter={handleAddTask}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          type="primary"
          onClick={handleAddTask}
          disabled={!newTaskDescription.trim()}
        >
          Agregar
        </Button>
      </div>
    </motion.div>
  );
}

export default GoalDetail;
