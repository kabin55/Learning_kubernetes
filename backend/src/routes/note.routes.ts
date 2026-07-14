import express from 'express';
import { getNotes, getNote, createNote, updateNote, deleteNote } from '../controllers/note.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect); // Apply to all note routes

router.route('/')
  .get(getNotes)
  .post(createNote);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

export default router;
