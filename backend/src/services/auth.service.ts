import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';

export const authService = {
  register: async (data: any) => {
    const { name, email, password } = data;

    const userExists = await userRepository.findByEmail(email);
    if (userExists) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const userToReturn = user.toObject() as any;
    delete userToReturn.password;
    
    return userToReturn;
  },

  login: async (data: any) => {
    const { email, password } = data;

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    });

    const userToReturn = user.toObject() as any;
    delete userToReturn.password;

    return { user: userToReturn, token };
  },

  getProfile: async (id: string) => {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
};
