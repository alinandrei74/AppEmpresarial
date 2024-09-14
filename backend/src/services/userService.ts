import { getUserByIdFromDB, updateUserInDB, getUserByUsernameFromDB } from '../data_access/userDataAccess';

// Obtener usuario por ID
export const getUserById = async (user_id: string) => {
  return await getUserByIdFromDB(user_id);
};

// Actualizar usuario por ID
export const updateUserById = async (user_id: string, userData: any) => {
  return await updateUserInDB(user_id, userData);
};

// Obtener usuario por username
export const getUserByUserName = async (username: string) => {
  return await getUserByUsernameFromDB(username);
};