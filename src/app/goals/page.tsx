"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, List, ListItem, ListItemText } from '@mui/material';

// Supongamos que tienes una lista de metas como esta:
const goals = [
  { id: '1', title: 'Mejorar hábitos de sueño' },
  { id: '2', title: 'Aumentar actividad física' },
  { id: '3', title: 'Reducir estrés' },
  // ... más metas
];

const Goals = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis Metas</h1>
      
      <Card>
        <CardContent>
          <List>
            {goals.map((goal) => (
              <ListItem key={goal.id} component={Link} href={`/goals/${goal.id}`}>
                <ListItemText primary={goal.title} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </div>
  );
}

export default Goals;
