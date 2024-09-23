"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.getUserData = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const validateRequest_1 = require("../middlewares/validateRequest");
const validationSchemas_1 = require("../validators/validationSchemas");
class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserError';
    }
}
exports.getUserData = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.idParamSchema, 'params'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const user = await db_1.db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
            if (user) {
                logger_1.default.success(`Datos del usuario con ID ${id} recuperados exitosamente`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: 'Datos del usuario recuperados exitosamente',
                    data: user,
                });
            }
            else {
                logger_1.default.error(`Usuario con ID ${id} no encontrado`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Usuario no encontrado',
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.finalError('Error interno al recuperar los datos del usuario:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                data: null,
            });
        }
    },
];
const getAllUsers = async (req, res) => {
    try {
        const users = await db_1.db.manyOrNone('SELECT * FROM users');
        if (users && users.length > 0) {
            logger_1.default.success('Todos los usuarios recuperados exitosamente');
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Usuarios recuperados exitosamente',
                data: users,
            });
        }
        else {
            logger_1.default.warning('No se encontraron usuarios en la base de datos');
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'No se encontraron usuarios',
                data: null,
            });
        }
    }
    catch (error) {
        logger_1.default.finalError('Error interno al recuperar todos los usuarios:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            data: null,
        });
    }
};
exports.getAllUsers = getAllUsers;
exports.deleteUser = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.idParamSchema, 'params'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await db_1.db.result('DELETE FROM users WHERE id = $1', [id]);
            if (result.rowCount > 0) {
                logger_1.default.success(`Usuario con ID ${id} eliminado correctamente`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: `Usuario con ID ${id} eliminado correctamente`,
                    data: null,
                });
            }
            else {
                logger_1.default.warning(`Usuario con ID ${id} no encontrado para eliminar`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Usuario no encontrado',
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.finalError('Error interno al eliminar usuario:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                data: null,
            });
        }
    },
];
