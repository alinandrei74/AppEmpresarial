import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definir un tipo para el usuario en la solicitud
interface UserPayload {
  id: string;
  role: string;
}

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
    return res.status(401).json({ message: 'No token provided' });
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Server configuration error: ACCESS_TOKEN_SECRET is missing' });
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user as UserPayload; 
    next();
  });
};

