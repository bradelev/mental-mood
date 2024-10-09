"use client";

import React, { useState } from 'react';
import * as motion from 'framer-motion/client'
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const icons = [
  { icon: SentimentVeryDissatisfiedIcon, color: 'text-red-500' },
  { icon: SentimentDissatisfiedIcon, color: 'text-orange-500' },
  { icon: SentimentSatisfiedIcon, color: 'text-yellow-500' },
  { icon: SentimentSatisfiedAltIcon, color: 'text-green-400' },
  { icon: SentimentVerySatisfiedIcon, color: 'text-green-600' },
];

const categories = ['work', 'health', 'relations', 'finance'];

const Feelings = () => {
  const [selectedFeelings, setSelectedFeelings] = useState({
    work: -1,
    health: -1,
    relations: -1,
    finance: -1
  });
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSend = () => {
    if (Object.values(selectedFeelings).every(feeling => feeling !== -1)) {
      const data = {
        feelings: selectedFeelings,
        comment: comment
      };
      localStorage.setItem('userFeelings', JSON.stringify(selectedFeelings));
      localStorage.setItem('userComment', comment);
      console.log(data);
      router.push('/chat');
    } else {
      setError('Por favor, selecciona un emoji para cada categoría antes de enviar.');
      toast.error('Faltan seleccionar emojis', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-blue-900">
          ¿Cómo te sientes hoy en estas áreas?
        </h1>

        <div className="grid grid-cols-6 gap-4">
          {categories.map((category) => (
            <React.Fragment key={category}>
              <div className="font-semibold flex items-center">{category}</div>
              {icons.map((iconData, iconIndex) => (
                <motion.button
                  key={`${category}-${iconIndex}`}
                  whileHover={{ scale: 1.5 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: selectedFeelings[category as keyof typeof selectedFeelings] === iconIndex ? 1.5 : 1 }}
                  transition={{ duration: 0.1 }}
                  className={`p-2 rounded-full`}
                  onClick={() => setSelectedFeelings(prev => ({ ...prev, [category]: iconIndex }))}
                >
                  <iconData.icon fontSize="large" className={iconData.color} />
                </motion.button>
              ))}
            </React.Fragment>
          ))}
        </div>
        
        <Textarea 
          placeholder="Comentarios adicionales" 
          className="w-full" 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {error && (
          <div className="text-red-500 text-sm mb-4 p-2 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {/* <Link href="/chat" passHref> */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSend}
          >
            Enviar
          </Button>
        {/* </Link> */}
      </div>
    </div>
  );
}

export default Feelings;
