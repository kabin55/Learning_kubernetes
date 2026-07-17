import { Request, Response } from 'express';
import Todo from '../models/Todo';

// @desc    Get all todos for a user
// @route   GET /api/todos
// @access  Private
export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ deadline: 1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single todo
// @route   GET /api/todos/:id
// @access  Private
export const getTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, deadline, status } = req.body;

    const todo = new Todo({
      user: req.user._id,
      title,
      description,
      deadline,
      status: status || 'pending',
    });

    const createdTodo = await todo.save();
    res.status(201).json(createdTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, deadline, status } = req.body;

    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    todo.title = title || todo.title;
    todo.description = description !== undefined ? description : todo.description;
    todo.deadline = deadline || todo.deadline;
    todo.status = status || todo.status;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a todo status
// @route   PATCH /api/todos/:id/status
// @access  Private
export const updateTodoStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    todo.status = status;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await todo.deleteOne();
    res.json({ message: 'Todo removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get todo summary
// @route   GET /api/todos/summary/stats
// @access  Private
export const getTodoSummary = async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find({ user: req.user._id });

    const total = todos.length;
    const completed = todos.filter(t => t.status === 'completed').length;
    const pendingTodos = todos.filter(t => t.status === 'pending');
    const pending = pendingTodos.length;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const overdue = pendingTodos.filter(t => new Date(t.deadline) < now).length;
    
    const dueToday = pendingTodos.filter(t => {
      const deadline = new Date(t.deadline);
      return deadline >= today && deadline < tomorrow && deadline >= now;
    }).length;

    const upcomingTodos = pendingTodos.filter(t => new Date(t.deadline) >= now);
    let nearestDeadline = null;
    
    if (upcomingTodos.length > 0) {
      upcomingTodos.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      nearestDeadline = {
        title: upcomingTodos[0].title,
        deadline: upcomingTodos[0].deadline
      };
    }

    res.json({
      total,
      completed,
      pending,
      overdue,
      dueToday,
      nearestDeadline
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
