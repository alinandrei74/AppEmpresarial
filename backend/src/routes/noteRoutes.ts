import { Router } from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/noteController';
import { authorizeRole } from '../middlewares/authRole';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Permitir lectura de notas a roles autorizados
router.get('/', authenticateToken, authorizeRole('notes', 'read'), getNotes);
router.get('/:id', authenticateToken, authorizeRole('notes', 'read'), getNoteById);


// Solo roles con permisos para crear notas
router.post('/', authenticateToken, authorizeRole('notes', 'create'), createNote);

// Permitir actualización de notas
router.put('/:id', authenticateToken, authorizeRole('notes', 'update'), updateNote);

// Solo admin puede eliminar notas
router.delete('/:id', authenticateToken, authorizeRole('notes', 'delete'), deleteNote);

export default router;
