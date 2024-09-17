import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authorizeRole } from '../middlewares/authRole';

const router = Router();

// Permitir a los roles que tengan permiso para leer tareas
router.get('/tasks', authorizeRole('tasks', 'read'), getTasks);

// Solo el rol admin puede crear tareas
router.post('/tasks', authorizeRole('tasks', 'create'), createTask);

// Roles con permiso para actualizar tareas
router.put('/tasks/:id', authorizeRole('tasks', 'update'), updateTask);

// Solo el rol admin puede eliminar tareas
router.delete('/tasks/:id', authorizeRole('tasks', 'delete'), deleteTask);

export default router;
