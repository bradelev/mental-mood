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

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showActionItemsButton, setShowActionItemsButton] = useState(false);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    const feelings = JSON.parse(localStorage.getItem('userFeelings') || '{}');
    const comment = localStorage.getItem('userComment') || '';
    const initialMessage = await sendMessageToChatGPT('Inicia la conversación teniendo en cuenta los sentimientos del usuario.', feelings, comment);
    try {
      const parsedMsg = JSON.parse(initialMessage);
      // const msg = (parsedMsg.list && parsedMsg.list.list.length > 0) ? parsedMsg.list.list : parsedMsg;
      setMessages([{ role: 'assistant', content: parsedMsg.message }]);
    } catch (error) {
      console.error('Error al parsear la respuesta JSON:', error);
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
        } else {
          setShowActionItemsButton(false);
          setActionItems([]);
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

  const ActionItemsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-10/12 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Selecciona las tareas</h2>
        {actionItems.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`task-${index}`}
              checked={selectedItems.includes(item)}
              onChange={() => {
                setSelectedItems(prev =>
                  prev.includes(item)
                    ? prev.filter(i => i !== item)
                    : [...prev, item]
                );
              }}
              className="mr-2"
            />
            <label htmlFor={`task-${index}`}>{item}</label>
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <Button onClick={handleConfirmActionItems} className="bg-green-500 text-white mr-2">
            Confirmar
          </Button>
          <Button onClick={() => setIsModalOpen(false)} className="bg-gray-300">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
  

  const handleConfirmActionItems = async () => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Nuevas tareas',
          tasks: selectedItems,
        }),
      });

      if (response.ok) {
        localStorage.setItem('actionItems', JSON.stringify(selectedItems));
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
      {isModalOpen && <ActionItemsModal />}

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Chat</h1>
          <Link href="/" className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
            <Home size={24} />
            <span className="sr-only">Ir a la página inicial</span>
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
                Generar lista de tareas
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
              placeholder="Escribe tu mensaje aquí..."
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