import { Router } from 'express';
import { registerUser, loginUser, verifyToken, logoutUser } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { userLoginSchema, userRegistrationSchema  } from '../validators/validationSchemas';
import { authorizeAdmin } from '../middlewares/autorizeAdmin';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

const authenticateAndAuthorizeAdmin = [
    authenticateToken, 
    authorizeAdmin, 
  ];

//Ruta para verificar token
router.get('/verify', verifyToken);

// Ruta para el registro
router.post('/register', authenticateAndAuthorizeAdmin, validateRequest(userRegistrationSchema), registerUser);

// Ruta para el login
router.post('/login', validateRequest(userLoginSchema),loginUser);

// Ruta para cerrar sesión
router.post('/logout', logoutUser);



export default router;
