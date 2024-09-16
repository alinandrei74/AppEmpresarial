///crear un codigo para que segun el user se tenga acceso o no a las distintas paginas:
//tareas:
//admin=>todo: todos los cruds de tareas
//mantenimiento=>maintenance: tareas role mantenimiento: verlas y actualizarlas
//limpieza=>cleaning: tareas role mantenimiento: verlas y actualizarlas
//reparto=>delivery: tareas role mantenimiento: verlas y actualizarlas
//notas:
//todos a todo: todos los cruds para todos los roles
//users:
//admin=>crea usuarios:acceso a todos los cruds de register
//maintenance-cleaning-delivery: no access _ status no access
//login:todos acceso a crud crear
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
