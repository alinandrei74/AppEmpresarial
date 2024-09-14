"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByUserName = exports.updateUserById = exports.getUserById = void 0;
const userDataAccess_1 = require("../data_access/userDataAccess");
const http_status_codes_1 = require("http-status-codes");
// Obtener usuario por ID
const getUserById = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userDataAccess_1.getUserByIdFromDB)(user_id);
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
});
exports.getUserById = getUserById;
// Actualizar usuario por ID
const updateUserById = (user_id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield (0, userDataAccess_1.updateUserInDB)(user_id, userData);
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
});
exports.updateUserById = updateUserById;
// Obtener usuario por username
const getUserByUserName = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userDataAccess_1.getUserByUsernameFromDB)(username);
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
});
exports.getUserByUserName = getUserByUserName;
