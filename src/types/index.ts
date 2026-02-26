import { Request } from 'express';

export interface JwtPayload {
  id: number;
  login: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
