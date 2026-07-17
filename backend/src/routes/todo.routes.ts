import express from 'express';
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
  updateTodoStatus,
  getTodoSummary,
} from '../controllers/todo.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect); // All todo routes are protected

router.route('/').get(getTodos).post(createTodo);
router.route('/summary').get(getTodoSummary); // Must be before /:id to avoid matching 'summary' as an id
router.route('/:id').get(getTodo).put(updateTodo).delete(deleteTodo);
router.route('/:id/status').patch(updateTodoStatus);

export default router;
