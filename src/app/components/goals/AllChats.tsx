import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

import Link from 'next/link';

interface Chat {
  id: number;
  title: string;
  lastUpdated: Date;
  status: string;
}

// Mock data para los chats (esto debería venir de una API en una aplicación real)
const chats: Chat[] = [
  { id: 1, title: 'Chat 1', lastUpdated: new Date(), status: 'completed' },
  { id: 2, title: 'Chat 2', lastUpdated: new Date(Date.now() - 86400000), status: 'overdue' },
  { id: 5, title: 'Chat 5', lastUpdated: new Date(Date.now() - 26400000), status: 'overdue' },
  { id: 4, title: 'Chat 4', lastUpdated: new Date(Date.now() - 16400000), status: 'completed' },
  { id: 3, title: 'Chat 3', lastUpdated: new Date(Date.now() - 172800000), status: 'in-progress' },
];

const AllChats = () => {
  const groupedChats = chats.reduce((acc, chat) => {
    acc[chat.status] = [...(acc[chat.status] || []), chat];
    return acc;
  }, {} as Record<string, typeof chats>);

  const renderChatGroup = (title: string, chats: Chat[], borderColor: string) => (
    <>
      <h2 className="text-xl font-bold mt-6 mb-3">{title}</h2>
      {chats.map((chat) => (
        <Link href={`/goals/${chat.id}`} key={chat.id}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg shadow-md ${borderColor} cursor-pointer hover:shadow-lg transition-shadow`}
          >
            <h3 className="text-lg font-semibold">{chat.title}</h3>
            <p className="text-sm text-gray-500">
            Last updated: {formatDistanceToNow(chat.lastUpdated, { addSuffix: true })}
            </p>
          </motion.div>
        </Link>
      ))}
    </>
  );

  return (
    <div className="space-y-4">
      {groupedChats['in-progress'] && renderChatGroup('Pending goals', groupedChats['in-progress'], 'border-t-4 border-blue-500')}
      {groupedChats['overdue'] && renderChatGroup('Overdue goals', groupedChats['overdue'], 'border-t-4 border-red-500')}
      {groupedChats['completed'] && renderChatGroup('Completed goals', groupedChats['completed'], 'border-t-4 border-green-500')}
    </div>
  );
};

export default AllChats;
