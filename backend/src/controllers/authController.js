"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const authService_1 = require("../services/authService");
const validationSchemas_1 = require("../validators/validationSchemas");
const validateRequest_1 = require("../middlewares/validateRequest");
const logger_1 = __importDefault(require("../utils/logger"));
const JWT_SECRET = process.env.JWT_SECRET;
exports.registerUser = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.userRegistrationSchema),
    async (req, res) => {
        try {
            const newUser = await (0, authService_1.registerUserService)(req.body);
            logger_1.default.success(`Usuario registrado exitosamente: ${req.body.username}`);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: http_status_codes_1.StatusCodes.CREATED,
                message: 'User registered successfully',
                data: newUser,
            });
        }
        catch (error) {
            logger_1.default.finalError('Error en el registro de usuario:', error.message || error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: error.message || 'An unexpected error occurred during registration',
                data: null,
            });
        }
    }
];
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        logger_1.default.warning('Intento de inicio de sesión sin credenciales');
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: 'Username and password are required',
            data: null,
        });
    }
    try {
        const result = await (0, authService_1.loginUserService)(username, password);
        if (!result) {
            logger_1.default.warning(`Credenciales inválidas para usuario: ${username}`);
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: 'Invalid credentials',
                data: null,
            });
        }
        const { token, user } = result;
        logger_1.default.success(`Inicio de sesión exitoso: ${username}`);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Login successful',
            data: { token: token, user: user },
        });
    }
    catch (error) {
        logger_1.default.finalError('Error durante el inicio de sesión:', error.message || error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message || 'An unexpected error occurred during login',
            data: null,
        });
    }
};
exports.loginUser = loginUser;
const verifyToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger_1.default.warning('Token no proporcionado o malformado');
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Token not provided or malformed',
            data: null,
        });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            logger_1.default.error('Token inválido o expirado');
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: 'Invalid or expired token',
                data: null,
            });
        }
        logger_1.default.success('Token verificado correctamente');
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Token verified successfully',
            data: decoded,
        });
    });
};
exports.verifyToken = verifyToken;
//TODO: potenciar logoutUser, agregar validación de token vacío y después el statusOk, convertir en post
const logoutUser = (req, res) => {
    // En este caso, simplemente respondemos con un éxito
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: http_status_codes_1.StatusCodes.OK,
        message: 'Logout successful',
        data: null,
    });
};
exports.logoutUser = logoutUser;
