"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getAllGoals, Goal, Status } from '@/api/goals';
import { Card, Button, Progress, Typography, Space } from 'antd';
import { PlusOutlined, ArrowRightOutlined, AimOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const fetchedGoals = await getAllGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Error fetching goals:', error);
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
        <Title level={2} className="mb-6">My Goals</Title>
        
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleNewConversation}
          size="large"
          className="mb-8"
        >
          Start new conversation
        </Button>
        
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/goals/${goal.id}`}>
                <Card
                  hoverable
                  title={
                    <Space>
                      <AimOutlined />
                      <Text strong>{goal.goal}</Text>
                    </Space>
                  }
                  extra={<ArrowRightOutlined />}
                >
                  <Text>
                    {goal.goals?.length} subtasks | {goal.goals?.filter(t => t.status === Status.COMPLETE).length} completed
                  </Text>
                  <Progress 
                    percent={Math.round((goal.goals?.filter(t => t.status === Status.COMPLETE).length ?? 0) / (goal.goals?.length ?? 1) * 100)}
                    status="active"
                  />
                </Card>
              </Link>
            </motion.div>
          ))}
        </Space>

        {goals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Text className="mb-4">{'You don\'t have any goals yet. Start a new conversation to create your first goals!'}</Text>
            <Button 
              type="primary"
              onClick={handleNewConversation}
            >
              Create my first goal
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Goals;
