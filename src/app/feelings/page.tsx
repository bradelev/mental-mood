"use client";

import React, { useState } from 'react';
import * as motion from 'framer-motion/client'
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import NavigationStepper from '../components/NavigationStepper';

const icons = [
  { icon: SentimentVeryDissatisfiedIcon, color: 'text-red-500' },
  { icon: SentimentDissatisfiedIcon, color: 'text-orange-500' },
  { icon: SentimentSatisfiedIcon, color: 'text-yellow-500' },
  { icon: SentimentSatisfiedAltIcon, color: 'text-green-400' },
  { icon: SentimentVerySatisfiedIcon, color: 'text-green-600' },
];


const tabs = ['work', 'health', 'relations', 'finance'];

const Home = () => {
  const [activeTab, setActiveTab] = useState('work');
  const [selectedIcon, setSelectedIcon] = useState<number>(-1);
  const [comment, setComment] = useState('');

  const handleSend = () => {
    if (selectedIcon) {
      const data = {
        feeling: selectedIcon,
        comment: comment,
        activeTab: activeTab
      };
      console.log(data, selectedIcon);
    } else {
      alert('Por favor, selecciona un emoji antes de enviar.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 space-y-6">
      {/* <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 space-y-6"
      > */}
        <h1 className="text-2xl font-bold text-center text-blue-900">
          How do you feel today?
        </h1>

        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between">
          {icons.map((iconData, index) => {
            const IconComponent = iconData.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ scale: selectedIcon === index ? 1.5 : 1 }}
                transition={{ duration: 0.2 }}
                className={`text-4xl ${iconData.color}`}
                onClick={() => setSelectedIcon(index)}
              >
                <IconComponent fontSize="large" />
              </motion.button>
            );
          })}
        </div>
        
        <Textarea 
          placeholder="Additional comments" 
          className="w-full" 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <Link href="/chat" passHref>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSend}
          >
            Send
          </Button>
        </Link>
        
        <NavigationStepper activeStep={1} />
    </div>
    </div>
  );
}

export default Home;
