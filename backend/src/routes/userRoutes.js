"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authRole_1 = require("../middlewares/authRole");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Importa el middleware de autenticación
const router = (0, express_1.Router)();
// Permitir que admin lea los datos de cualquier usuario
router.get('/user-profile/:id', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('users', 'read'), userController_1.getUserData);
// Solo admin puede listar todos los usuarios
router.get('/all', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('users', 'read'), userController_1.getAllUsers);
exports.default = router;
