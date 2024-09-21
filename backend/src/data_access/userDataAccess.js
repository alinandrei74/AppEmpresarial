"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserFromDB = exports.getUserByEmailFromDB = exports.getUserByUsernameFromDB = exports.createUserInDB = exports.updateUserInDB = exports.getUserByIdFromDB = void 0;
const db_1 = require("../config/db");
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
        return result; // Devolver el usuario directamente o null si no lo encuentra
    }
    catch (error) {
        if (error instanceof UserDataError) {
            console.error('User ID error:', error.message);
            throw error;
        }
        else {
            console.error('Error getting user by ID from DB:', error);
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
        const values = [...fields.map(field => userData[field]), user_id]; // Añadir el user_id al final
        // Realizar la actualización
        const result = await db_1.db.one(`UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, values);
        return result; // Devolver el usuario actualizado
    }
    catch (error) {
        if (error instanceof UserDataError) {
            console.error('User update error:', error.message);
            throw new UserDataError('Error updating user: ' + error.message);
        }
        else {
            console.error('Error updating user in DB:', error);
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
        return result; // Devolver el nuevo usuario creado
    }
    catch (error) {
        console.error('Error creating user in DB:', error);
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
        return result; // Devolver el usuario o null si no lo encuentra
    }
    catch (error) {
        console.error('Error fetching user by username:', error);
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
        return result; // Devolver el usuario o null si no lo encuentra
    }
    catch (error) {
        console.error('Error fetching user by email:', error);
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
        return { message: 'User deleted successfully' }; // Devolver mensaje de éxito
    }
    catch (error) {
        console.error('Error deleting user from DB:', error);
        throw new Error('Error deleting user from DB');
    }
};
exports.deleteUserFromDB = deleteUserFromDB;
