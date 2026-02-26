import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthRequest, JwtPayload } from '../types';
import { AppError } from '../utils/AppError';
import Lecturer from '../models/Lecturer';

export const login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { login: userLogin, password } = req.body;

    if (!userLogin || !password) {
      throw new AppError('Логин и пароль обязательны', 400);
    }

    const lecturer = await Lecturer.findOne({ where: { login: userLogin } });

    if (!lecturer) {
      throw new AppError('Неверный логин или пароль', 401);
    }

    const isMatch = await bcrypt.compare(password, lecturer.password);

    if (!isMatch) {
      throw new AppError('Неверный логин или пароль', 401);
    }

    const payload: JwtPayload = {
      id: lecturer.id,
      login: lecturer.login
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as string
    } as jwt.SignOptions);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: lecturer.id,
          first_name: lecturer.first_name,
          last_name: lecturer.last_name,
          middle_name: lecturer.middle_name,
          login: lecturer.login
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Не авторизован', 401);
    }

    const lecturer = await Lecturer.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!lecturer) {
      throw new AppError('Пользователь не найден', 404);
    }

    res.json({ success: true, data: lecturer });
  } catch (error) {
    next(error);
  }
};
