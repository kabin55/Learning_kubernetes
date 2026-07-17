import api from './api';

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  deadline: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface TodoData {
  title: string;
  description?: string;
  deadline: string;
  status?: 'pending' | 'completed';
}

export interface TodoSummary {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  nearestDeadline: {
    title: string;
    deadline: string;
  } | null;
}

const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

const getTodo = async (id: string) => {
  const response = await api.get(`/todos/${id}`);
  return response.data;
};

const createTodo = async (todoData: TodoData) => {
  const response = await api.post('/todos', todoData);
  return response.data;
};

const updateTodo = async (id: string, todoData: TodoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data;
};

const updateTodoStatus = async (id: string, status: 'pending' | 'completed') => {
  const response = await api.patch(`/todos/${id}/status`, { status });
  return response.data;
};

const deleteTodo = async (id: string) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

const getTodoSummary = async () => {
  const response = await api.get('/todos/summary');
  return response.data;
};

const todoService = {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  updateTodoStatus,
  deleteTodo,
  getTodoSummary,
};

export default todoService;
