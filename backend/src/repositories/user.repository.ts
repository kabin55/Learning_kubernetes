import { User } from '../models/User';

export const userRepository = {
  findByEmail: async (email: string) => {
    return User.findOne({ email }).select('+password');
  },
  findById: async (id: string) => {
    return User.findById(id);
  },
  create: async (data: any) => {
    return User.create(data);
  }
};
