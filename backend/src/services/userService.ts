import { getUserByIdFromDB, updateUserInDB, getUserByUsernameFromDB } from '../data_access/userDataAccess';
import { StatusCodes } from 'http-status-codes';

// Obtener usuario por ID
export const getUserById = async (user_id: string) => {
  try {
    const user = await getUserByIdFromDB(user_id);
    return {
      status: StatusCodes.OK,
      message: 'User found',
      data: user,
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error fetching user by ID',
    };
  }
};

// Actualizar usuario por ID
export const updateUserById = async (user_id: string, userData: any) => {
  try {
    const updatedUser = await updateUserInDB(user_id, userData);
    return {
      status: StatusCodes.OK,
      message: 'User updated successfully',
      data: updatedUser,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error updating user',
    };
  }
};

// Obtener usuario por username
export const getUserByUserName = async (username: string) => {
  try {
    const user = await getUserByUsernameFromDB(username);
    return {
      status: StatusCodes.OK,
      message: 'User found',
      data: user,
    };
  } catch (error) {
    console.error('Error fetching user by username:', error);
    throw {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error fetching user by username',
    };
  }
};
