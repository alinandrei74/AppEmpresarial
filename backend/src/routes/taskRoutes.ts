import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, getCompletedTasksByUserId } from '../controllers/taskController';
import { authorizeRole } from '../middlewares/authRole';
import { authenticateToken } from '../middlewares/authMiddleware'; // Asegúrate de importar el middleware correcto
import { validateRequest } from '../middlewares/validateRequest';
import { createTaskSchema, updateTaskSchema, userIdParamSchema, idParamSchema } from '../validators/validationSchemas';

const router = Router();

// Permite que cualquier usuario autenticado pueda ver las tareas
router.get('/', authenticateToken, authorizeRole('tasks', 'read'), getTasks);

// Nueva ruta para obtener todas las tareas completadas por un usuario
router.get('/completed/:userId', authenticateToken, authorizeRole('tasks', 'read'), validateRequest(userIdParamSchema, 'params'), getCompletedTasksByUserId);

// Solo admin puede crear tareas
router.post('/', authenticateToken, authorizeRole('tasks', 'create'), validateRequest(createTaskSchema), createTask);

// Permite que cualquier usuario autenticado pueda actualizar tareas
router.put('/:id', authenticateToken, authorizeRole('tasks', 'update'),  validateRequest(idParamSchema, 'params'), validateRequest(updateTaskSchema), updateTask);

// Solo admin puede eliminar tareas
router.delete('/:id', authenticateToken, authorizeRole('tasks', 'delete'), validateRequest(idParamSchema, 'params'), deleteTask);

export default router;
