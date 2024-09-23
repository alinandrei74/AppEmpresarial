import { Request, Response } from 'express';
import { db } from '../config/db';
import { StatusCodes } from 'http-status-codes';
import Logger from '../utils/logger';
import { validateRequest } from '../middlewares/validateRequest';
import { idParamSchema } from '../validators/validationSchemas'; 

class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}


export const getUserData = [
  validateRequest(idParamSchema, 'params'),  
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);

      if (user) {
        Logger.success(`Datos del usuario con ID ${id} recuperados exitosamente`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: 'Datos del usuario recuperados exitosamente',
          data: user,
        });
      } else {
        Logger.error(`Usuario con ID ${id} no encontrado`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: 'Usuario no encontrado',
          data: null,
        });
      }
    } catch (error) {
      Logger.finalError('Error interno al recuperar los datos del usuario:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        data: null,
      });
    }
  },
];


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.manyOrNone('SELECT * FROM users');
    if (users && users.length > 0) {
      Logger.success('Todos los usuarios recuperados exitosamente');
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Usuarios recuperados exitosamente',
        data: users,
      });
    } else {
      Logger.warning('No se encontraron usuarios en la base de datos');
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: 'No se encontraron usuarios',
        data: null,
      });
    }
  } catch (error) {
    Logger.finalError('Error interno al recuperar todos los usuarios:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
      data: null,
    });
  }
};


export const deleteUser = [
  validateRequest(idParamSchema, 'params'), 
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await db.result('DELETE FROM users WHERE id = $1', [id]);

      if (result.rowCount > 0) {
        Logger.success(`Usuario con ID ${id} eliminado correctamente`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: `Usuario con ID ${id} eliminado correctamente`,
          data: null,
        });
      } else {
        Logger.warning(`Usuario con ID ${id} no encontrado para eliminar`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: 'Usuario no encontrado',
          data: null,
        });
      }
    } catch (error) {
      Logger.finalError('Error interno al eliminar usuario:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        data: null,
      });
    }
  },
];
