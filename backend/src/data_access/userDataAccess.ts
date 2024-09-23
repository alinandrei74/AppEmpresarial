import { db } from '../config/db';
import { User } from '../types/user';
import Logger from '../utils/logger';

// Clase de error personalizada para manejo de datos de usuario
class UserDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserDataError';
  }
}

// Obtiene un usuario por ID
export const getUserByIdFromDB = async (user_id: string): Promise<User | null> => {
  try {
    if (!user_id) throw new UserDataError('User ID is required');

    const result = await db.oneOrNone<User>('SELECT * FROM users WHERE id = $1', [user_id]);
    if (result) {
      Logger.success(`Usuario con ID ${user_id} recuperado exitosamente.`);
    } else {
      Logger.warning(`Usuario con ID ${user_id} no encontrado.`);
    }
    return result;
  } catch (error) {
    if (error instanceof UserDataError) {
      Logger.error(`Error de ID de usuario: ${error.message}`);
      throw error;
    } else {
      Logger.finalError(`Error obteniendo usuario por ID de la DB: ${error}`);
      throw new Error('Error getting user from DB');
    }
  }
};

// Actualiza un usuario en la base de datos
export const updateUserInDB = async (user_id: string, userData: Partial<User>) => {
  try {
    if (!user_id) throw new UserDataError('User ID is required');

    // Verificar si el nuevo username ya existe (si se envía uno)
    if (userData.username) {
      const existingUser = await db.oneOrNone('SELECT id FROM users WHERE username = $1 AND id != $2', [userData.username, user_id]);
      if (existingUser) {
        throw new UserDataError('Username is already taken');
      }
    }

    // Extraer las claves y valores a actualizar dinámicamente
    const fields = Object.keys(userData);
    if (fields.length === 0) throw new UserDataError('At least one field is required to update');

    // Crear la parte dinámica de la consulta SQL
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    const values = [...fields.map(field => (userData as any)[field]), user_id];

    // Realizar la actualización
    const result = await db.one(`UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, values);

    Logger.success(`Usuario con ID ${user_id} actualizado exitosamente.`);
    return result;
  } catch (error) {
    if (error instanceof UserDataError) {
      Logger.error(`Error al actualizar el usuario: ${error.message}`);
      throw new UserDataError('Error updating user: ' + error.message);
    } else {
      Logger.finalError(`Error actualizando usuario en la DB: ${error}`);
      throw new Error('Error updating user in DB');
    }
  }
};

// Crea un nuevo usuario
export const createUserInDB = async (userData: {
  role: string;
  username: string;
  name: string;
  firstname: string;
  lastname: string;
  dni: string;
  email: string;
  telephone: string;
  address: string;
  cp: string;
  password: string; // Este es el hash de la contraseña
}) => {
  try {
    const result = await db.one<User>(
      `INSERT INTO users (role, username, name, firstname, lastname, dni, email, telephone, address, cp, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        userData.role, userData.username, userData.name,
        userData.firstname, userData.lastname, userData.dni,
        userData.email, userData.telephone, userData.address,
        userData.cp, userData.password
      ]
    );
    Logger.success(`Usuario creado exitosamente con username: ${userData.username}`);
    return result;
  } catch (error) {
    Logger.finalError(`Error creando usuario en la DB: ${error}`);
    throw new Error('Error creating user in DB');
  }
};

// Obtiene un usuario por username
export const getUserByUsernameFromDB = async (username: string): Promise<User | null> => {
  try {
    if (!username) {
      throw new UserDataError('Username is required');
    }

    const result = await db.oneOrNone<User>('SELECT * FROM users WHERE username = $1', [username]);
    if (result) {
      Logger.success(`Usuario con username ${username} recuperado exitosamente.`);
    } else {
      Logger.warning(`Usuario con username ${username} no encontrado.`);
    }
    return result;
  } catch (error) {
    Logger.finalError(`Error obteniendo usuario por username: ${error}`);
    throw new Error('Error fetching user by username');
  }
};

// Obtiene el usuario por email
export const getUserByEmailFromDB = async (email: string): Promise<User | null> => {
  try {
    if (!email) {
      throw new UserDataError('Email is required');
    }

    const result = await db.oneOrNone<User>('SELECT * FROM users WHERE email = $1', [email]);
    if (result) {
      Logger.success(`Usuario con email ${email} recuperado exitosamente.`);
    } else {
      Logger.warning(`Usuario con email ${email} no encontrado.`);
    }
    return result;
  } catch (error) {
    Logger.finalError(`Error obteniendo usuario por email: ${error}`);
    throw new Error('Error fetching user by email');
  }
};

// Función para eliminar un usuario de la base de datos
export const deleteUserFromDB = async (user_id: string | number) => {
  try {
    if (!user_id) {
      throw new UserDataError('User ID is required');
    }

    await db.none('DELETE FROM users WHERE id = $1', [user_id]);
    Logger.success(`Usuario con ID ${user_id} eliminado exitosamente.`);
    return { message: 'User deleted successfully' };
  } catch (error) {
    Logger.finalError(`Error eliminando usuario de la DB: ${error}`);
    throw new Error('Error deleting user from DB');
  }
};
