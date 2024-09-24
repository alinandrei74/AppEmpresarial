import { Router } from 'express';
import { registerUser, loginUser, verifyToken, logoutUser } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { userLoginSchema, userRegistrationSchema  } from '../validators/validationSchemas';

const router = Router();

// Ruta para el registro
router.post('/register', validateRequest(userRegistrationSchema), registerUser);

// Ruta para el login
router.post('/login', validateRequest(userLoginSchema),loginUser);

// Ruta para cerrar sesión
router.post('/logout', logoutUser);

//Ruta para verificar token
router.get('/verify', verifyToken);

export default router;
