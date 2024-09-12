"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// Ruta para el registro
router.post('/register', authController_1.registerUser);
// Ruta para el login
router.post('/login', authController_1.loginUser);
// Ruta para cerrar sesión
router.post('/logout', authController_1.logoutUser);
//Ruta para verificar token
router.get('/verify', authController_1.verifyToken);
exports.default = router;
