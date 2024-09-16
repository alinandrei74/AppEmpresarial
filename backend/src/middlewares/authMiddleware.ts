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
  
  // Comprobar si el header de autorización existe y está en el formato adecuado
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: 'No token provided or invalid token format',
      data: null,
    });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  // Verificar si la clave secreta existe
  if (!secret) {
    console.error('JWT_SECRET is missing in the environment variables.');
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Server configuration error: JWT_SECRET is missing',
      data: null,
    });
  }

  try {
    // Verificar el token y obtener el payload
    const decoded = jwt.verify(token, secret) as UserPayload;

    // Asignar el payload al objeto request
    req.user = decoded;
    next();
  } catch (err) {
    // Capturar errores de verificación de JWT
    console.error('JWT verification failed:', err);
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message: 'Invalid or expired token',
      data: null,
    });
  }
};

