import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authorizeRole } from '../middlewares/authRole';

const router = express.Router();

// Permite que cualquier usuario autenticado pueda ver las tareas
router.get('/tasks', getTasks);

// Solo admin puede crear tareas
router.post('/tasks', authorizeRole(['admin']), createTask);

// Permite que cualquier usuario autenticado pueda actualizar tareas
router.put('/tasks/:id', updateTask);

// Solo admin puede eliminar tareas
router.delete('/tasks/:id', authorizeRole(['admin']), deleteTask);

export default router;
