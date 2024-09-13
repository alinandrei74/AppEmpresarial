import { Request, Response } from 'express';
import { db } from '../config/db';

//! userController.ts:

//! Propósito: Manejar operaciones relacionadas con la gestión de usuarios más allá de la autenticación.
//! Funciones:
//! getUserData: Obtención de datos de usuario.

// Clase de error personalizada para el manejo de usuarios
class UserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserError';
  }
}

// Obtener datos del usuario
export const getUserData = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar que el ID esté presente
    if (!id) {
      throw new UserError('User ID is required');
    }

    const user = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    if (error instanceof UserError) {
      console.error('User data retrieval error:', error.message);
      res.status(400).json({ message: error.message }); // Errores de validación específicos
    } else {
      console.error('Error retrieving user data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};