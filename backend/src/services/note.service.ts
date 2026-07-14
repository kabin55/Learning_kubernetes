import { noteRepository } from '../repositories/note.repository';

export const noteService = {
  getAllNotes: async (userId: string) => {
    return noteRepository.findAllByUser(userId);
  },
  
  getNoteById: async (id: string, userId: string) => {
    const note = await noteRepository.findById(id, userId);
    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  },

  createNote: async (userId: string, data: any) => {
    return noteRepository.create({ ...data, userId });
  },

  updateNote: async (id: string, userId: string, data: any) => {
    const note = await noteRepository.update(id, userId, data);
    if (!note) {
      throw new Error('Note not found or unauthorized');
    }
    return note;
  },

  deleteNote: async (id: string, userId: string) => {
    const note = await noteRepository.delete(id, userId);
    if (!note) {
      throw new Error('Note not found or unauthorized');
    }
    return { id };
  }
};
