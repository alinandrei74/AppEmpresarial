//! userController.ts:

//! Propósito: Manejar operaciones relacionadas con la gestión de usuarios más allá de la autenticación.
//! Funciones:
//! getUserData: Obtención de datos de usuario.

import { Request, Response } from 'express';
import { db } from '../config/db';
import { StatusCodes } from 'http-status-codes';

class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

export const getUserData = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new UserError('User ID is required');
    }

    const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);

    if (user) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'User data fetched successfully',
        data: user,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: 'User not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof UserError) {
      console.error('User data retrieval error:', error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error('Error retrieving user data:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        data: null,
      });
    }
  }
};
