"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getGoalById, updateGoal, deleteGoal, Goal, Task, Status } from '@/api/goals';
import { List, Typography, Button, Input, Popconfirm, message, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

const GoalDetail = ({ params }: { params: { id: string } }) => {
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskDescription, setEditedTaskDescription] = useState('');

  const router = useRouter();

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const fetchedGoal = await getGoalById(parseInt(params.id));
        
        if (fetchedGoal) {
          setGoal(fetchedGoal);
          setEditedTitle(fetchedGoal.goal);
        }
      } catch (error) {
        console.error('Error loading goal:', error);
        message.error('Error loading goal');
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
        const updatedGoal = await updateGoal(goal.id, { goal: editedTitle.trim() });
        if (updatedGoal) {
          setGoal(updatedGoal);
          setIsEditing(false);
          message.success('Goal title updated successfully');
        }
      } catch (error) {
        console.error('Error updating goal title:', error);
        message.error('Error updating goal title');
      }
    }
  };

  const handleDeleteGoal = async () => {
    if (goal) {
      try {
        await deleteGoal(goal.id);
        message.success('Goal deleted successfully');
        router.push('/goals');
      } catch (error) {
        console.error('Error deleting goal:', error);
        message.error('Error deleting goal');
      }
    }
  };

  const handleAddTask = async () => {
    if (goal && newTaskDescription.trim()) {
      const newTask: Task = {
        id: Date.now(),
        goal: newTaskDescription.trim(),
        status: Status.INCOMPLETE,
        user_id: localStorage.getItem('username') || ''
      };
      const updatedTasks = [...(goal.goals ?? []), newTask];
      try {
        const payload: Partial<Goal> = {
          id: goal.id,
          goal: goal.goal,
          user_id: goal.user_id,
          goals: updatedTasks
        };
        const updatedGoal = await updateGoal(goal.id, payload);
        if (updatedGoal) {
          setGoal(updatedGoal);
          setNewTaskDescription('');
          message.success('New subtask added successfully');
        }
      } catch (error) {
        console.error('Error adding new subtask:', error);
        message.error('Error adding new subtask');
      }
    }
  };

  const handleToggleTask = async (taskId: number) => {
    if (goal) {
      const updatedTasks = goal?.goals?.map(task => 
        task.id === taskId ? { ...task, status: task.status === Status.COMPLETE ? Status.INCOMPLETE : Status.COMPLETE } : task
      ) as Task[];

      try {
        const payload: Partial<Goal> = {
          id: goal.id,
          goal: goal.goal,
          user_id: goal.user_id,
          goals: updatedTasks
        };
        const updatedGoal = await updateGoal(goal.id, payload);
        if (updatedGoal) {
          setGoal(updatedGoal);
          message.success('Subtask status updated successfully');
        }
      } catch (error) {
        console.error('Error updating subtask status:', error);
        message.error('Error updating subtask status');
      }
    }
  };

  const handleEditTask = (taskId: number, description: string) => {
    setEditingTaskId(taskId);
    setEditedTaskDescription(description);
  };

  const handleSaveTask = async () => {
    if (goal && editingTaskId && editedTaskDescription.trim()) {
      const updatedTasks = goal.goals.map(task =>
        task.id === editingTaskId ? { ...task, goal: editedTaskDescription.trim() } : task
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

  const handleDeleteTask = async (taskId: number) => {
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
    return <div>Loading...</div>;
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
        Back to goals list
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
          <Title level={2}>{goal.goal}</Title>
        )}
        <div>
          {isEditing ? (
            <Button icon={<SaveOutlined />} onClick={handleSaveTitle} type="primary">
              Save
            </Button>
          ) : (
            <Button icon={<EditOutlined />} onClick={handleEditTitle}>
              Edit
            </Button>
          )}
          <Popconfirm
            title="Are you sure you want to delete this goal?"
            onConfirm={handleDeleteGoal}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger style={{ marginLeft: 8 }}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      </div>

      <List
        className="bg-gray-50 rounded-lg p-4 mb-4"
        header={<Title level={4}>Subtasks</Title>}
        dataSource={goal.goals}
        renderItem={(task) => (
          <List.Item
            key={task.id}
            actions={[
              editingTaskId === task.id ? (
                <Button key="edit" icon={<SaveOutlined />} onClick={handleSaveTask} type="link">
                  Save
                </Button>
              ) : (
                <Button key="edit" icon={<EditOutlined />} onClick={() => handleEditTask(task.id, task.goal)} type="link">
                  Edit
                </Button>
              ),
              <Popconfirm
                key="delete"
                title="Are you sure you want to delete this subtask?"
                onConfirm={() => handleDeleteTask(task.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button icon={<DeleteOutlined />} type="link" danger>
                  Delete
                </Button>
              </Popconfirm>
            ]}
          >
            <Checkbox
              checked={task.status === Status.COMPLETE}
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
                <Typography.Text style={{ textDecoration: task.status === Status.COMPLETE ? 'line-through' : 'none' }}>
                  {task.goal}
                </Typography.Text>
              )}
            </Checkbox>
          </List.Item>
        )}
        locale={{ emptyText: 'No subtasks' }}
      />

      <div className="flex items-center">
        <Input
          placeholder="New subtask"
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
          Add
        </Button>
      </div>
    </motion.div>
  );
}

export default GoalDetail;
