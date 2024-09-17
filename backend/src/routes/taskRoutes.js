"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authRole_1 = require("../middlewares/authRole");
const router = (0, express_1.Router)();
// Permitir a los roles que tengan permiso para leer tareas
router.get('/tasks', (0, authRole_1.authorizeRole)('tasks', 'read'), taskController_1.getTasks);
// Solo el rol admin puede crear tareas
router.post('/tasks', (0, authRole_1.authorizeRole)('tasks', 'create'), taskController_1.createTask);
// Roles con permiso para actualizar tareas
router.put('/tasks/:id', (0, authRole_1.authorizeRole)('tasks', 'update'), taskController_1.updateTask);
// Solo el rol admin puede eliminar tareas
router.delete('/tasks/:id', (0, authRole_1.authorizeRole)('tasks', 'delete'), taskController_1.deleteTask);
exports.default = router;
