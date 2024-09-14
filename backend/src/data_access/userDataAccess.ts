import { db } from '../config/db';

// Clase de error personalizada para manejo de datos de usuario
class UserDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserDataError';
  }
}

// Obtiene un usuario por ID
export const getUserByIdFromDB = async (user_id: string) => {
  try {
    if (!user_id) throw new UserDataError('User ID is required');
    
    const result = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [user_id]);
    return result;
  } catch (error) {
    if (error instanceof UserDataError) {
      console.error('User ID error:', error.message);
      throw error; // Errores específicos
    } else {
      console.error('Error getting user by ID from DB:', error);
      throw new Error('Error getting user from DB'); // Error genérico
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
    return result;
  } catch (error) {
    if (error instanceof UserDataError) {
      console.error('User update error:', error.message);
      throw error; // Errores específicos
    } else {
      console.error('Error updating user in DB:', error);
      throw new Error('Error updating user in DB'); // Error genérico
    }
  }
};

// Crea un nuevo usuario
export const createUserInDB = async (userData: {
  role_id: string;
  username: string;
  name: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  telephone: string;
  address: string;
  cp: string;
  password: string; // Este es el hash de la contraseña
}) => {
  try {
    // Inserción de todos los campos obligatorios en la base de datos
    const result = await db.one(
      `INSERT INTO users (role_id, username, name, firstName, lastName, dni, email, telephone, address, cp, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        userData.role_id, userData.username, userData.name,
        userData.firstName, userData.lastName, userData.dni,
        userData.email, userData.telephone, userData.address,
        userData.cp, userData.password // Aquí se está almacenando el hash de la contraseña
      ]
    );
    return result;
  } catch (error) {
    console.error('Error creating user in DB:', error);
    throw new Error('Error creating user in DB');
  }
};

// Obtiene un usuario por username
export const getUserByUsernameFromDB = async (username: string) => {
  try {
    if (!username) {
      throw new Error('Username is required');
    }

    // Consulta para buscar el usuario por email
    const result = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
    return result; // Si no lo encuentra, debe devolver null
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw new Error('Error fetching user by username');
  }
};

// Obtiene el usuario por email
export const getUserByEmailFromDB = async (email: string) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    // Consulta para buscar el usuario por email
    const result = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    return result; // Si no lo encuentra, debe devolver null
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Error fetching user by email');
  }
};

// Función para eliminar un usuario de la base de datos
export const deleteUserFromDB = async (user_id: number) => {
  return db.none('DELETE FROM users WHERE id = $1', [user_id]);
};