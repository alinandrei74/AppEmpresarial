"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUserName = exports.updateUserById = exports.getUserById = void 0;
const userDataAccess_1 = require("../data_access/userDataAccess");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
// Obtener usuario por ID
const getUserById = async (user_id) => {
    try {
        logger_1.default.information(`Buscando usuario por ID: ${user_id}`);
        const user = await (0, userDataAccess_1.getUserByIdFromDB)(user_id);
        logger_1.default.success(`Usuario con ID ${user_id} encontrado`);
        return {
            status: http_status_codes_1.StatusCodes.OK,
            message: 'User found',
            data: user,
        };
    }
    catch (error) {
        logger_1.default.error(`Error al buscar usuario por ID: ${error}`);
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
        logger_1.default.information(`Actualizando usuario con ID: ${user_id}`);
        const updatedUser = await (0, userDataAccess_1.updateUserInDB)(user_id, userData);
        logger_1.default.success(`Usuario con ID ${user_id} actualizado exitosamente`);
        return {
            status: http_status_codes_1.StatusCodes.OK,
            message: 'User updated successfully',
            data: updatedUser,
        };
    }
    catch (error) {
        logger_1.default.error(`Error al actualizar usuario con ID: ${error}`);
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
        logger_1.default.information(`Buscando usuario por username: ${username}`);
        const user = await (0, userDataAccess_1.getUserByUsernameFromDB)(username);
        logger_1.default.success(`Usuario con username ${username} encontrado`);
        return {
            status: http_status_codes_1.StatusCodes.OK,
            message: 'User found',
            data: user,
        };
    }
    catch (error) {
        logger_1.default.error(`Error al buscar usuario por username: ${error}`);
        throw {
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error fetching user by username',
        };
    }
};
exports.getUserByUserName = getUserByUserName;
