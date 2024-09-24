import { getUserByIdFromDB, updateUserInDB, getUserByUsernameFromDB } from '../data_access/userDataAccess';
import { StatusCodes } from 'http-status-codes';
import Logger from '../utils/logger';


// Obtener usuario por ID
export const getUserById = async (user_id: string) => {
  try {
    Logger.information(`Buscando usuario por ID: ${user_id}`);
    const user = await getUserByIdFromDB(user_id);
    Logger.success(`Usuario con ID ${user_id} encontrado`);
    return {
      status: StatusCodes.OK,
      message: 'User found',
      data: user,
    };
  } catch (error) {
    Logger.error(`Error al buscar usuario por ID: ${error}`);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error fetching user by ID',
    };
  }
};

// Actualizar usuario por ID
export const updateUserById = async (user_id: string, userData: any) => {
  try {
    Logger.information(`Actualizando usuario con ID: ${user_id}`);
    const updatedUser = await updateUserInDB(user_id, userData);
    Logger.success(`Usuario con ID ${user_id} actualizado exitosamente`);
    return {
      status: StatusCodes.OK,
      message: 'User updated successfully',
      data: updatedUser,
    };
  } catch (error) {
    Logger.error(`Error al actualizar usuario con ID: ${error}`);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error updating user',
    };
  }
};

// Obtener usuario por username
export const getUserByUserName = async (username: string) => {
  try {
    Logger.information(`Buscando usuario por username: ${username}`);
    const user = await getUserByUsernameFromDB(username);
    Logger.success(`Usuario con username ${username} encontrado`);
    return {
      status: StatusCodes.OK,
      message: 'User found',
      data: user,
    };
  } catch (error) {
    Logger.error(`Error al buscar usuario por username: ${error}`);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error fetching user by username',
    };
  }
};
