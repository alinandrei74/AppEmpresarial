import { Router } from 'express';
import { getUserData, getAllUsers, deleteUser } from '../controllers/userController';
import { authorizeRole } from '../middlewares/authRole';
import { authenticateToken } from '../middlewares/authMiddleware'; // Importa el middleware de autenticación

const router = Router();

// Permitir que admin lea los datos de cualquier usuario
router.get('/user-profile/:id', authenticateToken, authorizeRole('users', 'read'), getUserData);

// Solo admin puede listar todos los usuarios
router.get('/all', authenticateToken, authorizeRole('users', 'read'), getAllUsers);

// Solo admin puede eliminar usuarios
router.delete('/:id', authenticateToken, authorizeRole('users', 'delete'), deleteUser);

export default router;
