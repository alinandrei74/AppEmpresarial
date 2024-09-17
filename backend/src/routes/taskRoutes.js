"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authRole_1 = require("../middlewares/authRole");
const router = express_1.default.Router();
// Permite que cualquier usuario autenticado pueda ver las tareas
router.get('/', taskController_1.getTasks); // Cambié '/tasks' a '/' para evitar redundancia en la URL.
// Solo admin puede crear tareas
router.post('/', (0, authRole_1.authorizeRole)(['admin']), taskController_1.createTask); // Cambié '/tasks' a '/' para evitar redundancia.
// Permite que cualquier usuario autenticado pueda actualizar tareas
router.put('/:id', taskController_1.updateTask); // Está bien como está, '/:id' para especificar la tarea que se actualiza.
// Solo admin puede eliminar tareas
router.delete('/:id', (0, authRole_1.authorizeRole)(['admin']), taskController_1.deleteTask); // Está bien como está, '/:id' para especificar la tarea a eliminar.
exports.default = router;
