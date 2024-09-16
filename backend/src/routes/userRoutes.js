"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Asegúrate de tener este archivo
const router = (0, express_1.Router)();
// Ruta protegida para obtener datos del usuario
router.get('/user-profile/:id', authMiddleware_1.authenticateToken, userController_1.getUserData, userController_1.getAllUsers);
exports.default = router;
