"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NavigationStepper from "../components/NavigationStepper";
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, { role: 'user', content: inputMessage }]);
      setInputMessage('');
      // Aquí iría la lógica para enviar el mensaje al backend y recibir una respuesta
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
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input de mensaje */}
        <div className="bg-white p-4">
          <div className="flex space-x-2">
            <Textarea 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-blue-500 text-white">
              Enviar
            </Button>
          </div>
        </div>

        {/* Navigation Stepper */}
        <NavigationStepper activeStep={2} />
      </div>
    </div>
  );
}

export default Chat;