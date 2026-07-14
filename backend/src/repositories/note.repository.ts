import { Note } from '../models/Note';

export const noteRepository = {
  findAllByUser: async (userId: string) => {
    return Note.find({ userId }).sort({ createdAt: -1 });
  },
  findById: async (id: string, userId: string) => {
    return Note.findOne({ _id: id, userId });
  },
  create: async (data: any) => {
    return Note.create(data);
  },
  update: async (id: string, userId: string, data: any) => {
    return Note.findOneAndUpdate({ _id: id, userId }, data, { new: true, runValidators: true });
  },
  delete: async (id: string, userId: string) => {
    return Note.findOneAndDelete({ _id: id, userId });
  }
};
