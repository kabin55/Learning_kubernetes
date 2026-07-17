import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  CircularProgress, 

  IconButton, 
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import todoService, { type Todo, type TodoSummary, type TodoData } from '../../services/todos.service';
import TodoSummaryCard from './TodoSummaryCard';
import TodoForm from './TodoForm';

interface TodoListProps {
  createSignal?: number;
}

const TodoList: React.FC<TodoListProps> = ({ createSignal }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [summary, setSummary] = useState<TodoSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Nearest Deadline');

  const fetchData = async () => {
    try {
      const [todosData, summaryData] = await Promise.all([
        todoService.getTodos(),
        todoService.getTodoSummary()
      ]);
      setTodos(todosData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to fetch todos', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setEditingTodo(null);
    setEditorOpen(true);
  };

  useEffect(() => {
    if (createSignal && createSignal > 0) {
      handleCreate();
    }
  }, [createSignal]);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoService.deleteTodo(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete todo', error);
      }
    }
  };

  const handleToggleStatus = async (todo: Todo) => {
    const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
    try {
      await todoService.updateTodoStatus(todo._id, newStatus);
      fetchData();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleFormSubmit = async (data: TodoData) => {
    if (editingTodo) {
      await todoService.updateTodo(editingTodo._id, data);
    } else {
      await todoService.createTodo(data);
    }
    fetchData();
  };

  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    // Filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (filter === 'Pending') {
      result = result.filter(t => t.status === 'pending');
    } else if (filter === 'Completed') {
      result = result.filter(t => t.status === 'completed');
    } else if (filter === 'Overdue') {
      result = result.filter(t => t.status === 'pending' && new Date(t.deadline) < now);
    } else if (filter === 'Due Today') {
      result = result.filter(t => {
        const d = new Date(t.deadline);
        return t.status === 'pending' && d >= today && d < tomorrow && d >= now;
      });
    }

    // Sort
    if (sort === 'Nearest Deadline') {
      result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sort === 'Latest Created') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'Oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sort === 'Alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [todos, filter, sort]);

  const getDeadlineColor = (deadline: string, status: string) => {
    if (status === 'completed') return 'success';
    const now = new Date();
    const d = new Date(deadline);
    if (d < now) return 'error';
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d >= today && d < tomorrow) return 'warning';
    return 'primary';
  };

  return (
    <Box>


      {summary && <TodoSummaryCard summary={summary} />}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
            <MenuItem value="Due Today">Due Today</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="Nearest Deadline">Nearest Deadline</MenuItem>
            <MenuItem value="Latest Created">Latest Created</MenuItem>
            <MenuItem value="Oldest">Oldest</MenuItem>
            <MenuItem value="Alphabetical">Alphabetical</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredAndSortedTodos.length === 0 ? (
            <Grid size={{ xs: 12 }}>
              <Typography color="text.secondary" align="center">No tasks found.</Typography>
            </Grid>
          ) : (
            filteredAndSortedTodos.map((todo) => (
              <Grid size={{ xs: 12, sm: 6, md: 6 }} key={todo._id}>
                <Card className="glass-panel transition-all" sx={{ height: '100%', display: 'flex', flexDirection: 'column', opacity: todo.status === 'completed' ? 0.7 : 1 }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h3" 
                        sx={{ textDecoration: todo.status === 'completed' ? 'line-through' : 'none', fontWeight: 500 }}
                      >
                        {todo.title}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handleToggleStatus(todo)} 
                        color={todo.status === 'completed' ? 'success' : 'default'}
                      >
                        {todo.status === 'completed' ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                      </IconButton>
                    </Box>
                    <Box sx={{ mb: 1.5 }}>
                      <Chip 
                        size="small" 
                        label={new Date(todo.deadline).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })} 
                        color={getDeadlineColor(todo.deadline, todo.status) as any} 
                        variant={todo.status === 'completed' ? 'outlined' : 'filled'}
                      />
                    </Box>
                    {todo.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {todo.description}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleEdit(todo)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(todo._id)}>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      <TodoForm 
        open={editorOpen} 
        onClose={() => setEditorOpen(false)} 
        onSubmit={handleFormSubmit}
        todo={editingTodo}
      />
    </Box>
  );
};

export default TodoList;
