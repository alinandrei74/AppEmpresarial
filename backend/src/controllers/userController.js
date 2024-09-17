"use strict";
//! userController.ts:
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
exports.getAllUsers = exports.getUserData = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserError';
    }
}
// Función para obtener datos de un usuario específico
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            throw new UserError('User ID is required');
        }
        const user = yield db_1.db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
        if (user) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'User data fetched successfully',
                data: user,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'User not found',
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof UserError) {
            console.error('User data retrieval error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error('Error retrieving user data:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                data: null,
            });
        }
    }
});
exports.getUserData = getUserData;
// Función para obtener datos de todos los usuarios
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.db.manyOrNone('SELECT * FROM users');
        if (users && users.length > 0) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'All users fetched successfully',
                data: users,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'No users found',
                data: null,
            });
        }
    }
    catch (error) {
        console.error('Error retrieving all users:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            data: null,
        });
    }
});
exports.getAllUsers = getAllUsers;
