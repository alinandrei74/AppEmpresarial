"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authRole_1 = require("../middlewares/authRole");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Importa el middleware de autenticación
const validateRequest_1 = require("../middlewares/validateRequest");
const validationSchemas_1 = require("../validators/validationSchemas");
const router = (0, express_1.Router)();
// Permitir que admin lea los datos de cualquier usuario
router.get('/user-profile/:id', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('users', 'read'), (0, validateRequest_1.validateRequest)(validationSchemas_1.userIdParamSchema, 'params'), userController_1.getUserData);
// Solo admin puede listar todos los usuarios
router.get('/all', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('users', 'read'), userController_1.getAllUsers);
// Solo admin puede eliminar usuarios
router.delete('/:id', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('users', 'delete'), (0, validateRequest_1.validateRequest)(validationSchemas_1.deleteUserSchema, 'params'), userController_1.deleteUser);
exports.default = router;
