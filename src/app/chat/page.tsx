"use client";


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessageToChatGPT } from '../../utils/chatGPTService';
import { Message } from '@/types/chatTypes';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import ReactMarkdown from 'react-markdown';
import { Spinner } from '@/components/ui/Spinner'; // Asegúrate de crear este componente

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = async () => {
    const feelings = JSON.parse(localStorage.getItem('userFeelings') || '{}');
    const initialMessage = await sendMessageToChatGPT('Inicia la conversación teniendo en cuenta los sentimientos del usuario.', feelings);
    setMessages([{ role: 'assistant', content: initialMessage }]);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() !== '') {
      const userMessage: Message = { role: 'user', content: inputMessage };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInputMessage('');
      setIsLoading(true);

      try {
        const assistantResponse = await sendMessageToChatGPT(inputMessage);
        const assistantMessage: Message = { role: 'assistant', content: assistantResponse };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        // Aquí podrías añadir un mensaje de error al usuario
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGenerateActionItems = () => {
    router.push('/goals');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      

      {/* Área principal de chat */}
      <div className="flex-1 flex flex-col">
        {/* Encabezado */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Chat</h1>
          <Button 
            onClick={handleGenerateActionItems}
            className="bg-green-500 text-white"
          >
            Generate action items
          </Button>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.role === 'user' ? (
                  message.content
                ) : (
                  <ReactMarkdown className="prose prose-sm max-w-none">
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          )}
        </div>

        {/* Input de mensaje */}
        <div className="bg-white p-4">
          <div className="flex space-x-2">
            <Textarea 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage} 
              className="bg-blue-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;