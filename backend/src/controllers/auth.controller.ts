import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await authService.register(validatedData);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error && error.message === 'User already exists') {
      res.status(400);
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { user, token } = await authService.login(validatedData);
    res.status(200).json({ success: true, data: user, token });
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid credentials') {
      res.status(401);
    }
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404);
    }
    next(error);
  }
};
