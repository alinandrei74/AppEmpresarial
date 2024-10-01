"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const authRole_1 = require("../middlewares/authRole");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Asegúrate de importar el middleware correcto
const validateRequest_1 = require("../middlewares/validateRequest");
const validationSchemas_1 = require("../validators/validationSchemas");
const router = (0, express_1.Router)();
// Permite que cualquier usuario autenticado pueda ver las tareas
router.get('/', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('tasks', 'read'), taskController_1.getTasks);
// Nueva ruta para obtener todas las tareas completadas por un usuario
router.get('/completed/:user_id', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('tasks', 'read'), (0, validateRequest_1.validateRequest)(validationSchemas_1.userIdParamSchema, 'params'), taskController_1.getCompletedTasksByUserId);
// Solo admin puede crear tareas
router.post('/', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('tasks', 'create'), (0, validateRequest_1.validateRequest)(validationSchemas_1.createTaskSchema), taskController_1.createTask);
// Permite que cualquier usuario autenticado pueda actualizar tareas
router.put('/:id', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('tasks', 'update'), (0, validateRequest_1.validateRequest)(validationSchemas_1.idParamSchema, 'params'), (0, validateRequest_1.validateRequest)(validationSchemas_1.updateTaskSchema), taskController_1.updateTask);
// Solo admin puede eliminar tareas
router.delete('/:id', authMiddleware_1.authenticateToken, (0, authRole_1.authorizeRole)('tasks', 'delete'), (0, validateRequest_1.validateRequest)(validationSchemas_1.idParamSchema, 'params'), taskController_1.deleteTask);
exports.default = router;
