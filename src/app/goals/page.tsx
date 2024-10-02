"use client";

import React, { useState } from 'react';

import NavigationStepper from '../components/NavigationStepper';
import AllChats from '../components/goals/AllChats';
import ActiveChat from '../components/goals/ActiveChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Card, CardContent } from '@mui/material';

const Goals = () => {
  const [activeTab, setActiveTab] = useState('all-chats');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Goals</h1>
      
      <Tabs defaultValue="all-chats" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-chats">All Chats</TabsTrigger>
          <TabsTrigger value="active-chat">Active Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="all-chats">
          <Card>
            <CardContent>
              <AllChats />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active-chat">
          <Card>
            <CardContent>
              <ActiveChat />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <NavigationStepper activeStep={3} />
    </div>
  );
}

export default Goals;
