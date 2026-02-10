import { Request } from 'express';

export interface JwtPayload {
  id: number;
  login: string;
  role: 'lecturer' | 'head_of_department';
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
