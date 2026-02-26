import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthRequest, JwtPayload } from '../types';
import { AppError } from '../utils/AppError';

export const auth = (req: AuthRequest, _res: Response, next: NextFunction): void => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new AppError('Токен не предоставлен', 401);
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError('Невалидный токен', 401));
  }
};
