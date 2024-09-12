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
exports.getUserByEmailFromDB = exports.createUserInDB = exports.updateUserInDB = exports.getUserByIdFromDB = void 0;
const db_1 = require("../config/db");
// Obtiene un usuario por ID
const getUserByIdFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.db.oneOrNone('SELECT * FROM users WHERE id = $1', [userId]);
        return result;
    }
    catch (error) {
        throw new Error('Error getting user from DB');
    }
});
exports.getUserByIdFromDB = getUserByIdFromDB;
// Actualiza un usuario en la base de datos
const updateUserInDB = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.db.one('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [userData.name, userData.email, userId]);
        return result;
    }
    catch (error) {
        throw new Error('Error updating user in DB');
    }
});
exports.updateUserInDB = updateUserInDB;
// Crea un nuevo usuario
const createUserInDB = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.db.one('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [userData.name, userData.email, userData.password]);
        return result;
    }
    catch (error) {
        throw new Error('Error creating user in DB');
    }
});
exports.createUserInDB = createUserInDB;
// Obtiene un usuario por email
const getUserByEmailFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
        return result;
    }
    catch (error) {
        throw new Error('Error getting user by email from DB');
    }
});
exports.getUserByEmailFromDB = getUserByEmailFromDB;
