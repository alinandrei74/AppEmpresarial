import express from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authorizeRole } from '../middlewares/authRole';

const router = express.Router();

// Permite que cualquier usuario autenticado pueda ver las tareas
router.get('/', getTasks); // Cambié '/tasks' a '/' para evitar redundancia en la URL.

// Solo admin puede crear tareas
router.post('/', authorizeRole(['admin']), createTask); // Cambié '/tasks' a '/' para evitar redundancia.

// Permite que cualquier usuario autenticado pueda actualizar tareas
router.put('/:id', updateTask); // Está bien como está, '/:id' para especificar la tarea que se actualiza.

// Solo admin puede eliminar tareas
router.delete('/:id', authorizeRole(['admin']), deleteTask); // Está bien como está, '/:id' para especificar la tarea a eliminar.

export default router;
