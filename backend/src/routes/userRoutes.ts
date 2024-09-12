import { Router } from 'express';
import { getUserData } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware'; // Asegúrate de tener este archivo

const router = Router();

// Ruta protegida para obtener datos del usuario
router.get('/user-profile/:id', authenticateToken, getUserData);

export default router;

