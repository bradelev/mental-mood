"use client"

import React, { useState, useEffect } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Checkbox, 
  IconButton, 
  TextField, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface Subgoal {
  id: string;
  description: string;
  dueDate: Date;
  completed: boolean;
}

const ActiveChat: React.FC<{ id: string }> = ({ id }) => {
  const [subgoals, setSubgoals] = useState<Subgoal[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSubgoal, setCurrentSubgoal] = useState<Subgoal | null>(null);

  useEffect(() => {
    // Here you should load the subgoals from your backend
    // For now, we'll use example data
    setSubgoals([
      { id: '1', description: 'Walk 30 minutes a day', dueDate: new Date(), completed: false },
      { id: '2', description: 'Do yoga twice a week', dueDate: new Date(), completed: false },
    ]);
  }, [id]);

  const handleToggleComplete = (id: string) => {
    setSubgoals(subgoals.map(subgoal => 
      subgoal.id === id ? { ...subgoal, completed: !subgoal.completed } : subgoal
    ));
  };

  const handleEdit = (subgoal: Subgoal) => {
    setCurrentSubgoal(subgoal);
    setOpenDialog(true);
  };

  const handleDelete = (id: string) => {
    setSubgoals(subgoals.filter(subgoal => subgoal.id !== id));
  };

  const handleSave = () => {
    if (currentSubgoal) {
      setSubgoals(subgoals.map(subgoal => 
        subgoal.id === currentSubgoal.id ? currentSubgoal : subgoal
      ));
      setOpenDialog(false);
      setCurrentSubgoal(null);
    }
  };

  return (
    <div>
      <h2>Subgoals for Increasing Physical Activity</h2>
      <List>
        {subgoals.map((subgoal) => (
          <ListItem key={subgoal.id} disablePadding>
            <Checkbox
              checked={subgoal.completed}
              onChange={() => handleToggleComplete(subgoal.id)}
            />
            <ListItemText 
              primary={subgoal.description}
              secondary={`Due date: ${subgoal.dueDate.toLocaleDateString()}`}
            />
            <IconButton onClick={() => handleEdit(subgoal)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(subgoal.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Subgoal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            value={currentSubgoal?.description || ''}
            onChange={(e) => setCurrentSubgoal(prev => prev ? {...prev, description: e.target.value} : null)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Due Date"
          value={currentSubgoal?.dueDate ? dayjs(currentSubgoal.dueDate) : null}
          onChange={(newValue) => setCurrentSubgoal(prev => prev ? {...prev, dueDate: newValue ? newValue.toDate() : new Date()} : null)}
        />
      </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ActiveChat;
