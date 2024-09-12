"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const noteController_1 = require("../controllers/noteController");
const router = (0, express_1.Router)();
// Rutas para las notas
router.get('/', noteController_1.getNotes);
router.get('/:id', noteController_1.getNoteById);
router.post('/', noteController_1.createNote);
router.put('/:id', noteController_1.updateNote);
router.delete('/:id', noteController_1.deleteNote);
exports.default = router;
