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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const authService_1 = require("../services/authService");
const JWT_SECRET = process.env.JWT_SECRET;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body; // Extraer los datos del cuerpo de la solicitud
    try {
        const requiredFields = [
            'role', 'username', 'name', 'firstname', 'lastname', 'dni',
            'email', 'telephone', 'address', 'cp', 'password'
        ];
        // Verificar que todos los campos requeridos están presentes
        for (const field of requiredFields) {
            if (!userData[field]) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: `Field ${field} is required`,
                    data: null,
                });
            }
        }
        // Llamar al servicio para registrar al usuario en la base de datos
        const newUser = yield (0, authService_1.registerUserService)(userData);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: 'User registered successfully',
            data: newUser,
        });
    }
    catch (error) {
        console.error('Error during user registration:', error.message || error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message || 'An unexpected error occurred during registration',
            data: null,
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: 'Username and password are required',
            data: null,
        });
    }
    try {
        const result = yield (0, authService_1.loginUserService)(username, password);
        if (!result) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: 'Invalid credentials',
                data: null,
            });
        }
        const { token, user } = result;
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Login successful',
            data: { token: token, user: user },
        });
    }
    catch (error) {
        console.error('Error during login:', error.message || error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: error.message || 'An unexpected error occurred during login',
            data: null,
        });
    }
});
exports.loginUser = loginUser;
const verifyToken = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: 'Token not provided or malformed',
            data: null,
        });
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: 'Invalid or expired token',
                data: null,
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Token verified successfully',
            data: decoded,
        });
    });
};
exports.verifyToken = verifyToken;
// ! TODO: potenciar logoutUser, agregar validación de token vacío y después el statusOk, convertir en post
const logoutUser = (req, res) => {
    // En este caso, simplemente respondemos con un éxito
    return res.status(http_status_codes_1.StatusCodes.OK).json({
        status: http_status_codes_1.StatusCodes.OK,
        message: 'Logout successful',
        data: null,
    });
};
exports.logoutUser = logoutUser;
