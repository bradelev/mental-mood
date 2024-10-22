'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { username: string }) => {
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('username', values.username);
      message.success('Login successful');
      router.push('/goals');
    } catch (error) {
      console.error('Login error:', error);
      message.error('Error logging in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <Title level={2} className="mb-6 text-blue-600 text-center">Login</Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </motion.div>
  );
};

export default Login;
