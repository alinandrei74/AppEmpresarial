import { Router } from 'express';
import { getUserData,getAllUsers } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware'; // Asegúrate de tener este archivo

const router = Router();

// Ruta protegida para obtener datos del usuario
router.get('/user-profile/:id', authenticateToken, getUserData);
router.get('/all',authenticateToken,getAllUsers)

export default router;

