import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authorizeRole } from '../middlewares/authRole';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Permitir a los roles que tengan permiso para leer tareas
router.get('/', authenticateToken, authorizeRole('tasks', 'read'), getTasks);

// Solo el rol admin puede crear tareas
router.post('/',authenticateToken, authorizeRole('tasks', 'create'), createTask);

// Roles con permiso para actualizar tareas
router.put('/:id', authenticateToken,  authorizeRole('tasks', 'update'), updateTask);

// Solo el rol admin puede eliminar tareas
router.delete('/:id', authenticateToken, authorizeRole('tasks', 'delete'), deleteTask);

export default router;
