"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteController_1 = require("../controllers/noteController");
const authRole_1 = require("../middlewares/authRole");
const router = (0, express_1.Router)();
// Permitir lectura de notas a roles autorizados
router.get('/', (0, authRole_1.authorizeRole)('notes', 'read'), noteController_1.getNotes);
router.get('/:id', (0, authRole_1.authorizeRole)('notes', 'read'), noteController_1.getNoteById);
// Solo roles con permisos para crear notas
router.post('/', (0, authRole_1.authorizeRole)('notes', 'create'), noteController_1.createNote);
// Permitir actualización de notas
router.put('/:id', (0, authRole_1.authorizeRole)('notes', 'update'), noteController_1.updateNote);
// Solo admin puede eliminar notas
router.delete('/:id', (0, authRole_1.authorizeRole)('notes', 'delete'), noteController_1.deleteNote);
exports.default = router;
