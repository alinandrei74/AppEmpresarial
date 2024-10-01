import { Router } from 'express';
import { getUserData, getAllUsers, deleteUser } from '../controllers/userController';
import { authorizeRole } from '../middlewares/authRole';
import { authenticateToken } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación
import { validateRequest } from '../middlewares/validateRequest';
import { userIdParamSchema, deleteUserSchema } from '../validators/validationSchemas';

const router = Router();

// Permitir que admin lea los datos de cualquier usuario
router.get('/user-profile/:id', authenticateToken, authorizeRole('users', 'read'), validateRequest(userIdParamSchema, 'params'), getUserData);

// Solo admin puede listar todos los usuarios
router.get('/all', authenticateToken, authorizeRole('users', 'read'), getAllUsers);

// Solo admin puede eliminar usuarios
router.delete('/:id', authenticateToken, authorizeRole('users', 'delete'), validateRequest(deleteUserSchema, 'params'), deleteUser);

export default router;
