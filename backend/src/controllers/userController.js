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
exports.getUserData = void 0;
const db_1 = require("../config/db");
//! userController.ts:
//! Propósito: Manejar operaciones relacionadas con la gestión de usuarios más allá de la autenticación.
//! Funciones:
//! getUserData: Obtención de datos de usuario.
// Clase de error personalizada para el manejo de usuarios
class UserError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserError';
    }
}
// Obtener datos del usuario
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Verificar que el ID esté presente
        if (!id) {
            throw new UserError('User ID is required');
        }
        const user = yield db_1.db.oneOrNone('SELECT * FROM users WHERE id = $1', [id]);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        if (error instanceof UserError) {
            console.error('User data retrieval error:', error.message);
            res.status(400).json({ message: error.message }); // Errores de validación específicos
        }
        else {
            console.error('Error retrieving user data:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.getUserData = getUserData;
