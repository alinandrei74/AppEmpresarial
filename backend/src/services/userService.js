"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUserName = exports.updateUserById = exports.getUserById = void 0;
const userDataAccess_1 = require("../data_access/userDataAccess");
const http_status_codes_1 = require("http-status-codes");
// Obtener usuario por ID
const getUserById = async (user_id) => {
    try {
        const user = await (0, userDataAccess_1.getUserByIdFromDB)(user_id);
        return {
            status: http_status_codes_1.StatusCodes.OK,
            message: 'User found',
            data: user,
        };
    }
    catch (error) {
        console.error('Error fetching user by ID:', error);
        throw {
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error fetching user by ID',
        };
    }
};
exports.getUserById = getUserById;
// Actualizar usuario por ID
const updateUserById = async (user_id, userData) => {
    try {
        const updatedUser = await (0, userDataAccess_1.updateUserInDB)(user_id, userData);
        return {
            status: http_status_codes_1.StatusCodes.OK,
            message: 'User updated successfully',
            data: updatedUser,
        };
    }
    catch (error) {
        console.error('Error updating user:', error);
        throw {
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error updating user',
        };
    }
};
exports.updateUserById = updateUserById;
// Obtener usuario por username
const getUserByUserName = async (username) => {
    try {
        const user = await (0, userDataAccess_1.getUserByUsernameFromDB)(username);
        return {
            status: http_status_codes_1.StatusCodes.OK,
            message: 'User found',
            data: user,
        };
    }
    catch (error) {
        console.error('Error fetching user by username:', error);
        throw {
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error fetching user by username',
        };
    }
};
exports.getUserByUserName = getUserByUserName;
