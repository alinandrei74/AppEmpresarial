import { db } from '../config/db';
import { User } from '../types/user';

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
    return result; // Devolver el usuario directamente o null si no lo encuentra
  } catch (error) {
    if (error instanceof UserDataError) {
      console.error('User ID error:', error.message);
      throw error;      
    } else {
      console.error('Error getting user by ID from DB:', error);
      throw new Error('Error getting user from DB');
    }
  }
};

// Actualiza un usuario en la base de datos
export const updateUserInDB = async (user_id: string, userData: { name?: string; email?: string }) => {
  try {
    if (!user_id) throw new UserDataError('User ID is required');
    if (!userData.name && !userData.email) throw new UserDataError('At least one field (name or email) is required to update');

    const result = await db.one(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [userData.name || null, userData.email || null, user_id]
    );
    return result; // Devolver el usuario actualizado
  } catch (error) {
    if (error instanceof UserDataError) {
      console.error('User update error:', error.message);
      throw new UserDataError('Error updating user: ' + error.message);
    } else {
      console.error('Error updating user in DB:', error);
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
    return result; // Devolver el nuevo usuario creado
  } catch (error) {
    console.error('Error creating user in DB:', error);
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
    return result; // Devolver el usuario o null si no lo encuentra
  } catch (error) {
    console.error('Error fetching user by username:', error);
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
    return result; // Devolver el usuario o null si no lo encuentra
  } catch (error) {
    console.error('Error fetching user by email:', error);
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
    return { message: 'User deleted successfully' }; // Devolver mensaje de éxito
  } catch (error) {
    console.error('Error deleting user from DB:', error);
    throw new Error('Error deleting user from DB');
  }
};
