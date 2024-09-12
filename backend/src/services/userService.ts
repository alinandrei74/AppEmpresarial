import { getUserByIdFromDB, updateUserInDB, getUserByEmailFromDB } from '../data_access/userDataAccess';

// Obtener usuario por ID
export const getUserById = async (userId: string) => {
  return await getUserByIdFromDB(userId);
};

// Actualizar usuario por ID
export const updateUserById = async (userId: string, userData: any) => {
  return await updateUserInDB(userId, userData);
};

// Obtener usuario por email
export const getUserByEmail = async (email: string) => {
  return await getUserByEmailFromDB(email);
};