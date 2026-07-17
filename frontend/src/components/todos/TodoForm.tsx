import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress
} from '@mui/material';
import { type Todo, type TodoData } from '../../services/todos.service';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TodoData) => Promise<void>;
  todo?: Todo | null;
}

const TodoForm: React.FC<Props> = ({ open, onClose, onSubmit, todo }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<'pending' | 'completed'>('pending');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      
      // Format date for datetime-local input (YYYY-MM-DDThh:mm)
      if (todo.deadline) {
        const d = new Date(todo.deadline);
        // Ensure local time is formatted correctly for the input
        const localIso = new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0,16);
        setDeadline(localIso);
      }
      setStatus(todo.status);
    } else {
      // Default to tomorrow for new todos
      setTitle('');
      setDescription('');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const localIso = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().slice(0,16);
      
      setDeadline(localIso);
      setStatus('pending');
    }
  }, [todo, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    setLoading(true);
    try {
      await onSubmit({
        title,
        description,
        deadline: new Date(deadline).toISOString(),
        status
      });
      onClose();
    } catch (error) {
      console.error('Failed to save todo', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{todo ? 'Edit Todo' : 'Create New Todo'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
            
            <TextField
              label="Description (Optional)"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            
            <TextField
              label="Deadline"
              type="datetime-local"
              fullWidth
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              disabled={loading}
            />

            {todo && (
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value as 'pending' | 'completed')}
                  disabled={loading}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={loading} color="inherit">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading || !title.trim() || !deadline}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {todo ? 'Save Changes' : 'Create Todo'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TodoForm;
