"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailService = exports.getUserByUsernameService = exports.loginUserService = exports.registerUserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDataAccess_1 = require("../data_access/userDataAccess");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';
// Define los campos obligatorios
const requiredFields = [
    'role', 'username', 'name', 'firstname', 'lastname',
    'dni', 'email', 'telephone', 'address', 'postal_code', 'password'
];
// Función para lanzar errores
const throwError = (status, message) => {
    throw { status, message };
};
// Servicio para registrar un nuevo usuario
const registerUserService = async (userData) => {
    try {
        logger_1.default.information(`Intentando registrar usuario: ${userData.email}`);
        const existingUser = await (0, userDataAccess_1.getUserByEmailFromDB)(userData.email);
        if (existingUser) {
            logger_1.default.warning('Usuario con este correo ya existe');
            throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'User with this email already exists' };
        }
        // Hashear la contraseña
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        // Crear el usuario en la base de datos
        const newUser = await (0, userDataAccess_1.createUserInDB)(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        logger_1.default.success(`Usuario registrado exitosamente: ${newUser.email}`);
        return {
            status: http_status_codes_1.StatusCodes.CREATED,
            message: 'User registered successfully',
            data: newUser,
        };
    }
    catch (error) {
        logger_1.default.error(`Error al registrar usuario: ${error.message || 'Error inesperado'}`);
        if (error.status) {
            throw error;
        }
        throwError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred during registration');
    }
};
exports.registerUserService = registerUserService;
// Servicio para iniciar sesión de un usuario
const loginUserService = async (username, password) => {
    try {
        logger_1.default.information(`Intentando iniciar sesión con el usuario: ${username}`);
        const user = await (0, userDataAccess_1.getUserByUsernameFromDB)(username);
        if (!user) {
            logger_1.default.warning('Credenciales inválidas');
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            logger_1.default.warning('Credenciales inválidas');
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ user: user }, SECRET_KEY, { expiresIn: '1h' });
        logger_1.default.success(`Usuario ${username} ha iniciado sesión exitosamente`);
        return { token, user };
    }
    catch (error) {
        logger_1.default.error('Error durante el inicio de sesión');
        throw new Error('Login failed');
    }
};
exports.loginUserService = loginUserService;
// Servicios para obtener usuario por username o email
const getUserByUsernameService = (username) => {
    logger_1.default.information(`Buscando usuario por username: ${username}`);
    return getUserService(username, userDataAccess_1.getUserByUsernameFromDB, 'username');
};
exports.getUserByUsernameService = getUserByUsernameService;
const getUserByEmailService = (email) => {
    logger_1.default.information(`Buscando usuario por email: ${email}`);
    return getUserService(email, userDataAccess_1.getUserByEmailFromDB, 'email');
};
exports.getUserByEmailService = getUserByEmailService;
// Servicio genérico reutilizado para obtener usuario
const getUserService = async (identifier, getUserFn, fieldName) => {
    try {
        if (!identifier) {
            logger_1.default.warning(`El campo ${fieldName} es requerido`);
            throwError(http_status_codes_1.StatusCodes.BAD_REQUEST, `${fieldName} is required`);
        }
        const user = await getUserFn(identifier);
        if (!user) {
            logger_1.default.warning(`Usuario con ${fieldName} no encontrado`);
            throwError(http_status_codes_1.StatusCodes.NOT_FOUND, `User with ${fieldName} not found`);
        }
        logger_1.default.success(`Usuario con ${fieldName} encontrado`);
        return {
            status: http_status_codes_1.StatusCodes.OK,
            message: `User with ${fieldName} found`,
            data: user,
        };
    }
    catch (error) {
        logger_1.default.error(`Error al buscar usuario por ${fieldName}: ${error.message}`);
        throwError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Error fetching user by ${fieldName}`);
    }
};
