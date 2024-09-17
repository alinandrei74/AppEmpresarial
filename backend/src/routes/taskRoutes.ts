import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';
import { authorizeRole } from '../middlewares/authRole';

const router = Router();

// Permite que cualquier usuario autenticado pueda ver las tareas
router.get('/', getTasks); // Cambié '/tasks' a '/' para evitar redundancia en la URL.
// Permitir a los roles que tengan permiso para leer tareas
router.get('/tasks', authorizeRole('tasks', 'read'), getTasks);

// Solo admin puede crear tareas
router.post('/', authorizeRole(['admin']), createTask); // Cambié '/tasks' a '/' para evitar redundancia.
// Solo el rol admin puede crear tareas
router.post('/tasks', authorizeRole('tasks', 'create'), createTask);

// Permite que cualquier usuario autenticado pueda actualizar tareas
router.put('/:id', updateTask); // Está bien como está, '/:id' para especificar la tarea que se actualiza.
// Roles con permiso para actualizar tareas
router.put('/tasks/:id', authorizeRole('tasks', 'update'), updateTask);

// Solo admin puede eliminar tareas
router.delete('/:id', authorizeRole(['admin']), deleteTask); // Está bien como está, '/:id' para especificar la tarea a eliminar.
// Solo el rol admin puede eliminar tareas
router.delete('/tasks/:id', authorizeRole('tasks', 'delete'), deleteTask);

export default router;
