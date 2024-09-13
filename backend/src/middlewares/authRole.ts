import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
      }

      if (!decoded || !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
      }

      next();
    });
  };
};
