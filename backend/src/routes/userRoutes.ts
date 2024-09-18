import { Router } from 'express';
import { getUserData, getAllUsers } from '../controllers/userController';
import { authorizeRole } from '../middlewares/authRole';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Permitir que admin lea los datos de cualquier usuario
router.get('/user-profile/:id', authenticateToken, authorizeRole('users', 'read'), getUserData);

// Solo admin puede listar todos los usuarios
router.get('/all', authenticateToken, authorizeRole('users', 'read'), getAllUsers);

export default router;
