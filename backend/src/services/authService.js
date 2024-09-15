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
exports.getUserByEmailService = exports.getUserByUsernameService = exports.loginUserService = exports.registerUserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDataAccess_1 = require("../data_access/userDataAccess");
const http_status_codes_1 = require("http-status-codes");
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';
// Define los campos obligatorios
const requiredFields = [
    'role', 'username', 'name', 'firstname', 'lastname',
    'dni', 'email', 'telephone', 'address', 'cp', 'password'
];
// Función para lanzar errores, mejorando el tipado
const throwError = (status, message) => {
    throw { status, message };
};
// Servicio para registrar un nuevo usuario
const registerUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUser = yield (0, userDataAccess_1.getUserByEmailFromDB)(userData.email);
        if (existingUser) {
            throw { status: http_status_codes_1.StatusCodes.BAD_REQUEST, message: 'User with this email already exists' };
        }
        // Hashear la contraseña
        const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
        // Crear el usuario en la base de datos
        const newUser = yield (0, userDataAccess_1.createUserInDB)(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
        return {
            status: http_status_codes_1.StatusCodes.CREATED,
            message: 'User registered successfully',
            data: newUser,
        };
    }
    catch (error) {
        const errorMessage = error.message || 'An unexpected error occurred during registration';
        console.error('Registration error:', errorMessage);
        if (error.status) {
            throw error;
        }
        throwError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred during registration');
    }
});
exports.registerUserService = registerUserService;
// Servicio para iniciar sesión de un usuario
const loginUserService = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userDataAccess_1.getUserByUsernameFromDB)(username);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = jsonwebtoken_1.default.sign({ user: user }, SECRET_KEY, { expiresIn: '1h' });
        return { token, user };
    }
    catch (error) {
        throw new Error('Login failed');
    }
});
exports.loginUserService = loginUserService;
// Servicio genérico para obtener un usuario por un identificador (username o email)
const getUserService = (identifier, getUserFn, fieldName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!identifier) {
            throwError(http_status_codes_1.StatusCodes.BAD_REQUEST, `${fieldName} is required`);
        }
        const user = yield getUserFn(identifier);
        if (!user) {
            throwError(http_status_codes_1.StatusCodes.NOT_FOUND, `User with ${fieldName} not found`);
        }
        return {
            status: http_status_codes_1.StatusCodes.OK,
            message: `User with ${fieldName} found`,
            data: user,
        };
    }
    catch (error) {
        const errorMessage = error.message || `An unexpected error occurred while fetching user by ${fieldName}`;
        console.error(`Error fetching user by ${fieldName}:`, errorMessage);
        throwError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, errorMessage);
    }
});
// Servicios para obtener usuario por username o email, reutilizando la lógica de `getUserService`
const getUserByUsernameService = (username) => getUserService(username, userDataAccess_1.getUserByUsernameFromDB, 'username');
exports.getUserByUsernameService = getUserByUsernameService;
const getUserByEmailService = (email) => getUserService(email, userDataAccess_1.getUserByEmailFromDB, 'email');
exports.getUserByEmailService = getUserByEmailService;
