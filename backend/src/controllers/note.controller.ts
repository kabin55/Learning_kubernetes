import { Request, Response, NextFunction } from 'express';
import { noteService } from '../services/note.service';
import { createNoteSchema, updateNoteSchema } from '../validators/note.validator';

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await noteService.getAllNotes(req.user.id);
    res.status(200).json({ success: true, count: notes.length, data: notes });
  } catch (error) {
    next(error);
  }
};

export const getNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.getNoteById(req.params.id as string, req.user.id);
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404);
    }
    next(error);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createNoteSchema.parse(req.body);
    const note = await noteService.createNote(req.user.id, validatedData);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateNoteSchema.parse(req.body);
    const note = await noteService.updateNote(req.params.id as string, req.user.id, validatedData);
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404);
    }
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await noteService.deleteNote(req.params.id as string, req.user.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404);
    }
    next(error);
  }
};
