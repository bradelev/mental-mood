"use client";


import React, { useState, useEffect, useRef } from 'react';
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
        let parsedResponse;
        try {
          parsedResponse = JSON.parse(assistantResponse);
        } catch (error) {
          console.error('Error al parsear la respuesta JSON:', error);
          parsedResponse = { message: assistantResponse };
        }

        const assistantMessage: Message = { role: 'assistant', content: parsedResponse.message };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);

        if (parsedResponse.list && parsedResponse.list.list.length > 0) {
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
  };

  const handleGenerateActionItems = () => {
    if (actionItems.length > 0) {
      setSelectedItems(actionItems);
      setIsModalOpen(true);
    }
  };

  const ActionItemsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
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
    <div className="flex h-screen bg-gray-100">
      {isModalOpen && <ActionItemsModal />}

      {/* Área principal de chat */}
      <div className="flex-1 flex flex-col">
        {/* Encabezado */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-900">Chat</h1>
          {showActionItemsButton && (
            <Button 
              onClick={handleGenerateActionItems}
              className="bg-green-500 text-white"
            >
              Generar lista de tareas
            </Button>
          )}
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {message.role === 'user' ? (
                  (() => {
                    try {
                      return JSON.parse(message.content).message;
                    } catch {
                      return message.content; // Fallback al contenido original si el parsing falla
                    }
                  })()
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
          <div ref={messagesEndRef} /> {/* Elemento invisible al final de los mensajes */}
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