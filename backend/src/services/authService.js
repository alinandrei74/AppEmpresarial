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
exports.getUserByEmailService = exports.loginUserService = exports.registerUserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDataAccess_1 = require("../data_access/userDataAccess");
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';
// Define los campos obligatorios
const requiredFields = [
    'rol', 'username', 'name', 'firstName', 'lastName',
    'dni', 'email', 'telephone', 'address', 'cp', 'password'
];
// Servicio para registrar un nuevo usuario
const registerUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verifica que todos los campos estén presentes
        for (const field of requiredFields) {
            if (!userData[field]) {
                throw new Error(`Field ${field} is required`);
            }
        }
        // Verifica si el usuario ya existe
        const existingUser = yield (0, userDataAccess_1.getUserByEmailFromDB)(userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Hashea la contraseña antes de guardarla
        const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
        console.log('Original password:', userData.password);
        console.log('Hashed password during registration:', hashedPassword);
        // Guarda el nuevo usuario en la base de datos
        return yield (0, userDataAccess_1.createUserInDB)(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
    }
    catch (error) {
        const errorMessage = error instanceof Error && error.message ? error.message : 'An unexpected error occurred';
        if (errorMessage === 'User with this email already exists') {
            console.error('Registration error:', errorMessage);
            throw {
                status: 400,
                message: errorMessage,
            };
        }
        console.error('Unexpected error during registration:', errorMessage);
        throw {
            status: 500,
            message: 'An unexpected error occurred during registration',
        };
    }
});
exports.registerUserService = registerUserService;
// Servicio para iniciar sesión de un usuario
const loginUserService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Verifica si los parámetros están presentes
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        // Obtén el usuario de la base de datos
        const user = yield (0, userDataAccess_1.getUserByEmailFromDB)(email);
        if (!user) {
            throw new Error('User not found');
        }
        // Verifica si la contraseña es correcta
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        console.log('Password comparison:', { password, hash: user.password, isMatch });
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        // Genera un token JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        return { token, user };
    }
    catch (error) {
        const errorMessage = error instanceof Error && error.message ? error.message : 'An unexpected error occurred';
        // Manejar errores específicos de autenticación
        if (errorMessage === 'User not found' || errorMessage === 'Invalid credentials') {
            console.error('Authentication error:', errorMessage);
            throw {
                status: 401,
                message: errorMessage,
            };
        }
        console.error('Unexpected error during login:', errorMessage);
        throw {
            status: 500,
            message: 'An unexpected error occurred during login',
        };
    }
});
exports.loginUserService = loginUserService;
// Servicio para obtener un usuario por email
const getUserByEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!email) {
            throw new Error('Email is required');
        }
        const user = yield (0, userDataAccess_1.getUserByEmailFromDB)(email);
        return user;
    }
    catch (error) {
        console.error('Error fetching user by email:', error);
        throw {
            status: 500,
            message: 'An unexpected error occurred while fetching user by email',
        };
    }
});
exports.getUserByEmailService = getUserByEmailService;
