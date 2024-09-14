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
const authService_1 = require("../services/authService");
// Clave secreta para JWT desde las variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';
// Controlador para el registro de usuarios
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    try {
        // Verifica que todos los campos necesarios estén presentes
        const requiredFields = ['rol', 'username', 'name', 'firstName', 'lastName', 'dni', 'email', 'telephone', 'address', 'cp', 'password'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                return res.status(400).json({ message: `Field ${field} is required` });
            }
        }
        // Llama a `registerUserService` que manejará la verificación de si el usuario existe y la creación
        const user = yield (0, authService_1.registerUserService)(userData);
        res.status(201).json({ id: user.id, email: user.email });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('Field')) {
                return res.status(400).json({ message: error.message });
            }
            if (error.message.includes('Database')) {
                return res.status(500).json({ message: 'Database error' });
            }
            return res.status(500).json({ message: 'An unexpected error occurred during registration' });
        }
        res.status(500).json({ message: 'An unexpected error occurred during registration' });
    }
});
exports.registerUser = registerUser;
// Controlador para el inicio de sesión de usuarios
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const token = yield (0, authService_1.loginUserService)(username, password);
        if (!token) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ token });
    }
    catch (error) {
        console.error('Error during login:', error); // Log del error para obtener más detalles
        res.status(500).json({ message: 'An unexpected error occurred during login' });
    }
});
exports.loginUser = loginUser;
// Controlador para verificar el token
const verifyToken = (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Token not provided' });
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err)
            return res.status(401).json({ message: 'Invalid or expired token' });
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
