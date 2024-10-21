'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
// import { Amplify } from 'aws-amplify';

import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import { Input } from '@mui/material';

// Amplify.configure(awsconfig);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Inicio de sesión exitoso')
      
      router.push('/goals');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      toast.error('Error al iniciar sesión. Por favor, intenta de nuevo.', {
        duration: 3000,
        position: 'top-center',
      });
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
        <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">Iniciar sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full"
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              <>
                <LogIn className="mr-2" size={20} />
                Iniciar sesión
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
