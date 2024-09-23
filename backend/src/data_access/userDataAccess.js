"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserFromDB = exports.getUserByEmailFromDB = exports.getUserByUsernameFromDB = exports.createUserInDB = exports.updateUserInDB = exports.getUserByIdFromDB = void 0;
const db_1 = require("../config/db");
const logger_1 = __importDefault(require("../utils/logger"));
// Clase de error personalizada para manejo de datos de usuario
class UserDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UserDataError';
    }
}
// Obtiene un usuario por ID
const getUserByIdFromDB = async (user_id) => {
    try {
        if (!user_id)
            throw new UserDataError('User ID is required');
        const result = await db_1.db.oneOrNone('SELECT * FROM users WHERE id = $1', [user_id]);
        if (result) {
            logger_1.default.success(`Usuario con ID ${user_id} recuperado exitosamente.`);
        }
        else {
            logger_1.default.warning(`Usuario con ID ${user_id} no encontrado.`);
        }
        return result;
    }
    catch (error) {
        if (error instanceof UserDataError) {
            logger_1.default.error(`Error de ID de usuario: ${error.message}`);
            throw error;
        }
        else {
            logger_1.default.finalError(`Error obteniendo usuario por ID de la DB: ${error}`);
            throw new Error('Error getting user from DB');
        }
    }
};
exports.getUserByIdFromDB = getUserByIdFromDB;
// Actualiza un usuario en la base de datos
const updateUserInDB = async (user_id, userData) => {
    try {
        if (!user_id)
            throw new UserDataError('User ID is required');
        // Verificar si el nuevo username ya existe (si se envía uno)
        if (userData.username) {
            const existingUser = await db_1.db.oneOrNone('SELECT id FROM users WHERE username = $1 AND id != $2', [userData.username, user_id]);
            if (existingUser) {
                throw new UserDataError('Username is already taken');
            }
        }
        // Extraer las claves y valores a actualizar dinámicamente
        const fields = Object.keys(userData);
        if (fields.length === 0)
            throw new UserDataError('At least one field is required to update');
        // Crear la parte dinámica de la consulta SQL
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        const values = [...fields.map(field => userData[field]), user_id];
        // Realizar la actualización
        const result = await db_1.db.one(`UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, values);
        logger_1.default.success(`Usuario con ID ${user_id} actualizado exitosamente.`);
        return result;
    }
    catch (error) {
        if (error instanceof UserDataError) {
            logger_1.default.error(`Error al actualizar el usuario: ${error.message}`);
            throw new UserDataError('Error updating user: ' + error.message);
        }
        else {
            logger_1.default.finalError(`Error actualizando usuario en la DB: ${error}`);
            throw new Error('Error updating user in DB');
        }
    }
};
exports.updateUserInDB = updateUserInDB;
// Crea un nuevo usuario
const createUserInDB = async (userData) => {
    try {
        const result = await db_1.db.one(`INSERT INTO users (role, username, name, firstname, lastname, dni, email, telephone, address, cp, password)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`, [
            userData.role, userData.username, userData.name,
            userData.firstname, userData.lastname, userData.dni,
            userData.email, userData.telephone, userData.address,
            userData.cp, userData.password
        ]);
        logger_1.default.success(`Usuario creado exitosamente con username: ${userData.username}`);
        return result;
    }
    catch (error) {
        logger_1.default.finalError(`Error creando usuario en la DB: ${error}`);
        throw new Error('Error creating user in DB');
    }
};
exports.createUserInDB = createUserInDB;
// Obtiene un usuario por username
const getUserByUsernameFromDB = async (username) => {
    try {
        if (!username) {
            throw new UserDataError('Username is required');
        }
        const result = await db_1.db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);
        if (result) {
            logger_1.default.success(`Usuario con username ${username} recuperado exitosamente.`);
        }
        else {
            logger_1.default.warning(`Usuario con username ${username} no encontrado.`);
        }
        return result;
    }
    catch (error) {
        logger_1.default.finalError(`Error obteniendo usuario por username: ${error}`);
        throw new Error('Error fetching user by username');
    }
};
exports.getUserByUsernameFromDB = getUserByUsernameFromDB;
// Obtiene el usuario por email
const getUserByEmailFromDB = async (email) => {
    try {
        if (!email) {
            throw new UserDataError('Email is required');
        }
        const result = await db_1.db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
        if (result) {
            logger_1.default.success(`Usuario con email ${email} recuperado exitosamente.`);
        }
        else {
            logger_1.default.warning(`Usuario con email ${email} no encontrado.`);
        }
        return result;
    }
    catch (error) {
        logger_1.default.finalError(`Error obteniendo usuario por email: ${error}`);
        throw new Error('Error fetching user by email');
    }
};
exports.getUserByEmailFromDB = getUserByEmailFromDB;
// Función para eliminar un usuario de la base de datos
const deleteUserFromDB = async (user_id) => {
    try {
        if (!user_id) {
            throw new UserDataError('User ID is required');
        }
        await db_1.db.none('DELETE FROM users WHERE id = $1', [user_id]);
        logger_1.default.success(`Usuario con ID ${user_id} eliminado exitosamente.`);
        return { message: 'User deleted successfully' };
    }
    catch (error) {
        logger_1.default.finalError(`Error eliminando usuario de la DB: ${error}`);
        throw new Error('Error deleting user from DB');
    }
};
exports.deleteUserFromDB = deleteUserFromDB;
