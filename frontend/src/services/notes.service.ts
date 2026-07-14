import api from './api';

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const notesService = {
  getAll: async (): Promise<Note[]> => {
    const res = await api.get('/notes');
    return res.data.data;
  },
  getById: async (id: string): Promise<Note> => {
    const res = await api.get(`/notes/${id}`);
    return res.data.data;
  },
  create: async (data: { title: string; content: string }): Promise<Note> => {
    const res = await api.post('/notes', data);
    return res.data.data;
  },
  update: async (id: string, data: { title?: string; content?: string }): Promise<Note> => {
    const res = await api.put(`/notes/${id}`, data);
    return res.data.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`);
  }
};
