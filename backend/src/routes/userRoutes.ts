import { Router } from 'express';
import { getUserData, getAllUsers } from '../controllers/userController';
import { authorizeRole } from '../middlewares/authRole';

const router = Router();

// Permitir que admin lea los datos de cualquier usuario
router.get('/user-profile/:id', authorizeRole('users', 'read'), getUserData);

// Solo admin puede listar todos los usuarios
router.get('/all', authorizeRole('users', 'read'), getAllUsers);

export default router;
