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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authService_1 = require("../services/authService");
//! authController.ts:
//! Propósito: Manejar la autenticación y los tokens.
//! Funciones:
// registerUser: Registro de usuario (esto puede estar aquí si estás manejando el registro y la autenticación en un mismo flujo).
// loginUser: Inicio de sesión.
// verifyToken: Verificación de tokens.
// logoutUser: Cierre de sesión.
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    try {
        // Verifica si el usuario ya existe
        const existingUser = yield (0, authService_1.getUserByEmailService)(userData.email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hashea la contraseña antes de guardarla
        const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
        userData.password = hashedPassword;
        const user = yield (0, authService_1.registerUserService)(userData);
        res.status(201).json({ id: user.id, email: user.email });
    }
    catch (error) {
        res.status(400).json({ message: 'Error registering user' });
    }
});
exports.registerUser = registerUser;
// Controlador para el inicio de sesión de usuarios
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Usa el servicio para iniciar sesión
        const token = yield (0, authService_1.loginUserService)(email, password);
        res.json({ token });
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});
exports.loginUser = loginUser;
// Controlador para verificar el token
const verifyToken = (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Token no proporcionado' });
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
        if (err)
            return res.status(401).json({ message: 'Token inválido o expirado' });
        res.status(200).json(decoded);
    });
};
exports.verifyToken = verifyToken;
// Controlador para cerrar sesión
const logoutUser = (req, res) => {
    // La invalidación del token en el cliente generalmente se maneja allí
    // Aquí simplemente devolvemos una respuesta de éxito
    res.json({ message: 'Logout successful' });
};
exports.logoutUser = logoutUser;
