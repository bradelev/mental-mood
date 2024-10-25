"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { sendMessageToChatGPT } from '../../utils/chatGPTService';
import { Message } from '@/types/chatTypes';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import ReactMarkdown from 'react-markdown';
import { Spinner } from '@/components/ui/Spinner';
import { Home, Send, List } from 'lucide-react';
import { Modal, Checkbox, Button as AntButton, Typography, Space } from 'antd';

const { Title } = Typography;

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showActionItemsButton, setShowActionItemsButton] = useState(false);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    const feelings = JSON.parse(localStorage.getItem('userFeelings') || '{}');
    const comment = localStorage.getItem('userComment') || '';
    const initialMessage = await sendMessageToChatGPT('Start the conversation taking into account the user\'s feelings.', feelings, comment);
    try {
      const parsedMsg = JSON.parse(initialMessage);
      setMessages([{ role: 'assistant', content: parsedMsg.message }]);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      setMessages([{ role: 'assistant', content: initialMessage }]);
    }
  };

  const handleSendMessage = useCallback(async () => {
    if (inputMessage.trim() !== '') {
      const userMessage: Message = { role: 'user', content: inputMessage };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      try {
        const assistantResponse = await sendMessageToChatGPT(inputMessage);
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(assistantResponse);
        } catch (error) {
          console.error('Error al parsear la respuesta JSON:', error);
          parsedResponse = { message: assistantResponse };
        }

        const assistantMessage: Message = { role: 'assistant', content: parsedResponse.message };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);

        if (parsedResponse?.list?.list?.length > 0) {
          setActionItems(parsedResponse.list.list);
          setShowActionItemsButton(true);
          // Agregar el título
          if (parsedResponse.list.title) {
            setTitle(parsedResponse.list.title);
          }
        } else {
          setShowActionItemsButton(false);
          setActionItems([]);
          setTitle(''); // Limpiar el título si no hay lista
        }
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        // Aquí podrías añadir un mensaje de error al usuario
      } finally {
        setIsLoading(false);
      }
    }
  }, [inputMessage]); // Añade otras dependencias si es necesario

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        handleSendMessage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSendMessage]); 

  const handleGenerateActionItems = () => {
    if (actionItems.length > 0) {
      setSelectedItems(actionItems);
      setIsModalOpen(true);
    }
  };

  const ActionItemsModal: React.FC<{ title: string }> = ({ title }) => (
    <Modal
      title={<Title level={4}>{title}</Title>}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={[
        <AntButton key="cancel" type="text" onClick={() => setIsModalOpen(false)}>
          Cancel
        </AntButton>,
        <AntButton key="confirm" type="primary" onClick={handleConfirmActionItems}>
          Confirm
        </AntButton>,
      ]}
      width="80%"
      styles={{
        body: {
          maxHeight: '60vh',
          overflowY: 'auto',
        },
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {actionItems.map((item, index) => (
          <Checkbox
            key={index}
            checked={selectedItems.includes(item)}
            onChange={(e) => {
              setSelectedItems(prev =>
                e.target.checked
                  ? [...prev, item]
                  : prev.filter(i => i !== item)
              );
            }}
          >
            {item}
          </Checkbox>
        ))}
      </Space>
    </Modal>
  );
  

  const handleConfirmActionItems = async () => {
    try {
      const body = {
        goal: title,
        user_id: 'pepe@arionkoder.com',
        goals: selectedItems,
      };
      console.log('body', body);
      const response = await fetch('https://bytebusters.arionkoder.com/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        localStorage.setItem('actionItems', JSON.stringify(selectedItems));
        localStorage.setItem('goalTitle', title); // Guardamos el título en localStorage
        router.push('/goals');
      } else {
        console.error('Error al crear las tareas');
      }
    } catch (error) {
      console.error('Error al enviar las tareas:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="flex h-screen bg-gray-100"
    >
      {isModalOpen && <ActionItemsModal title={title} />}

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Chat</h1>
          <Link href="/" className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
            <Home size={24} />
            <span className="sr-only">Go to home page</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow-md'}`}>
              <ReactMarkdown 
    className={`prose prose-sm max-w-none ${message.role === 'user' ? 'text-white prose-invert' : ''}`}
  >
                  {message.content}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          )}
          {showActionItemsButton && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mt-4"
            >
              <Button 
                onClick={handleGenerateActionItems}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              >
                <List className="mr-2" size={20} />
                Generate task list
              </Button>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white p-4 shadow-md">
          <div className="flex space-x-2">
            <Textarea 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="text-white">
                  <Spinner />
                </div>
              ) : (
                <Send size={20} />
              )}
              <span className="ml-2 sr-only">Enviar</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Chat;
