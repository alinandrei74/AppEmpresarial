import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: 'Token no proporcionado',
        data: null,
      });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          status: StatusCodes.UNAUTHORIZED,
          message: 'Token inválido o expirado',
          data: null,
        });
      }

      if (!decoded || !roles.includes(decoded.role)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          message: 'No tienes permiso para acceder a esta ruta',
          data: null,
        });
      }

      next();
    });
  };
};
