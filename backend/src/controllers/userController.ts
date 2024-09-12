import { Request, Response } from 'express';
import { db } from '../config/db';

//! userController.ts:

//! Propósito: Manejar operaciones relacionadas con la gestión de usuarios más allá de la autenticación.
//! Funciones:
//! getUserData: Obtención de datos de usuario.


// Obtener datos del usuario
export const getUserData = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

