import { db } from '../config/db'; 

// Obtiene un usuario por ID
export const getUserByIdFromDB = async (userId: string) => {
  try {
    const result = await db.oneOrNone('SELECT * FROM users WHERE id = $1', [userId]);
    return result;
  } catch (error) {
    throw new Error('Error getting user from DB');
  }
};

// Actualiza un usuario en la base de datos
export const updateUserInDB = async (userId: string, userData: any) => {
  try {
    const result = await db.one(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [userData.name, userData.email, userId]
    );
    return result;
  } catch (error) {
    throw new Error('Error updating user in DB');
  }
};

// Crea un nuevo usuario
export const createUserInDB = async (userData: any) => {
  try {
    const result = await db.one(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [userData.name, userData.email, userData.password]
    );
    return result;
  } catch (error) {
    throw new Error('Error creating user in DB');
  }
};

// Obtiene un usuario por email
export const getUserByEmailFromDB = async (email: string) => {
  try {
    const result = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    return result;
  } catch (error) {
    throw new Error('Error getting user by email from DB');
  }
};



