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
exports.getUserByUsernameFromDB = exports.createUserInDB = exports.updateUserInDB = exports.getUserByIdFromDB = void 0;
const db_1 = require("../config/db");
// Clase de error personalizada para manejo de datos de usuario
class UserDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserDataError';
    }
}
// Obtiene un usuario por ID
const getUserByIdFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!userId)
            throw new UserDataError('User ID is required');
        const result = yield db_1.db.oneOrNone('SELECT * FROM users WHERE id = $1', [userId]);
        return result;
    }
    catch (error) {
        if (error instanceof UserDataError) {
            console.error('User ID error:', error.message);
            throw error; // Errores específicos
        }
        else {
            console.error('Error getting user by ID from DB:', error);
            throw new Error('Error getting user from DB'); // Error genérico
        }
    }
});
exports.getUserByIdFromDB = getUserByIdFromDB;
// Actualiza un usuario en la base de datos
const updateUserInDB = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!userId)
            throw new UserDataError('User ID is required');
        if (!userData.name && !userData.email)
            throw new UserDataError('At least one field (name or email) is required to update');
        const result = yield db_1.db.one('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [userData.name || null, userData.email || null, userId]);
        return result;
    }
    catch (error) {
        if (error instanceof UserDataError) {
            console.error('User update error:', error.message);
            throw error; // Errores específicos
        }
        else {
            console.error('Error updating user in DB:', error);
            throw new Error('Error updating user in DB'); // Error genérico
        }
    }
});
exports.updateUserInDB = updateUserInDB;
// Crea un nuevo usuario
const createUserInDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Inserción de todos los campos obligatorios en la base de datos
        const result = yield db_1.db.one(`INSERT INTO users (rol, username, name, firstName, lastName, dni, email, telephone, address, cp, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`, [
            userData.rol, userData.username, userData.name,
            userData.firstName, userData.lastName, userData.dni,
            userData.email, userData.telephone, userData.address,
            userData.cp, userData.password // Aquí se está almacenando el hash de la contraseña
        ]);
        return result;
    }
    catch (error) {
        console.error('Error creating user in DB:', error);
        throw new Error('Error creating user in DB');
    }
});
exports.createUserInDB = createUserInDB;
// Obtiene un usuario por username
const getUserByUsernameFromDB = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!username) {
            throw new Error('Username is required');
        }
        // Consulta para buscar el usuario por email
        const result = yield db_1.db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
        return result; // Si no lo encuentra, debe devolver null
    }
    catch (error) {
        console.error('Error fetching user by username:', error);
        throw new Error('Error fetching user by username');
    }
});
exports.getUserByUsernameFromDB = getUserByUsernameFromDB;
