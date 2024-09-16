import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { User } from '../types/user';

// Definir un tipo para el usuario en la solicitud
interface UserPayload extends Omit<User, 'password'> {}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: 'No token provided',
      data: null,
    });
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Server configuration error: ACCESS_TOKEN_SECRET is missing',
      data: null,
    });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({
        status: StatusCodes.FORBIDDEN,
        message: 'Invalid token',
        data: null,
      });
    }

    req.user = user as UserPayload;
    next();
  });
};

