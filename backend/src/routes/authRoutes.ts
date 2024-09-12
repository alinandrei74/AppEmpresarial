import { Router } from 'express';
import { registerUser, loginUser, verifyToken, logoutUser } from '../controllers/authController'; 

const router = Router();

// Ruta para el registro
router.post('/register', registerUser);

// Ruta para el login
router.post('/login', loginUser);

// Ruta para cerrar sesión
router.post('/logout', logoutUser);

//Ruta para verificar token
router.get('/verify', verifyToken);

export default router;
