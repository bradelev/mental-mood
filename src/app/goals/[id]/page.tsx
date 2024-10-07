"use client";

import React from 'react';
import Link from 'next/link';
// import ActiveChat from "../../components/goals/ActiveChat";
import { Button } from '@mui/material';

const ChatPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="container mx-auto p-4">
      <Link href="/goals">
        <Button variant="contained" color="primary" className="mb-4">
          Volver a Metas
        </Button>
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">Chat de Meta {params.id}</h1>
      
      {/* <ActiveChat id={params.id} /> */}
    </div>
  );
};

export default ChatPage;
