"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authRole_1 = require("../middlewares/authRole");
const router = express_1.default.Router();
// Permite que cualquier usuario autenticado pueda ver las tareas
router.get('/tasks', taskController_1.getTasks);
// Solo admin puede crear tareas
router.post('/tasks', (0, authRole_1.authorizeRole)(['admin']), taskController_1.createTask);
// Permite que cualquier usuario autenticado pueda actualizar tareas
router.put('/tasks/:id', taskController_1.updateTask);
// Solo admin puede eliminar tareas
router.delete('/tasks/:id', (0, authRole_1.authorizeRole)(['admin']), taskController_1.deleteTask);
exports.default = router;
