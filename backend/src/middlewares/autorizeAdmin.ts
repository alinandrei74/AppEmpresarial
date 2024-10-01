import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from '../types/user';
import Logger from '../utils/logger';

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (!user || user.role !== 'admin') { 
    Logger.warning('Acceso denegado: Se requiere rol de administrador');
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message: 'Acceso denegado: Se requiere rol de administrador',
      data: null,
    });
  }


  next();
};

