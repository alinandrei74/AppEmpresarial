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
import { validateRequest } from '../middlewares/validateRequest';
import { createNoteSchema, updateNoteSchema, idParamSchema } from '../validators/validationSchemas';

const router = Router();

// Permitir lectura de notas a roles autorizados
router.get('/', authenticateToken, authorizeRole('notes', 'read'), getNotes);
router.get('/:id', authenticateToken, validateRequest(idParamSchema, 'params'), authorizeRole('notes', 'read'), getNoteById);

// Solo roles con permisos para crear notas
router.post('/', authenticateToken, validateRequest(createNoteSchema), authorizeRole('notes', 'create'), createNote);

// Permitir actualización de notas
router.put('/:id', authenticateToken, validateRequest(updateNoteSchema), validateRequest(idParamSchema, 'params'),authorizeRole('notes', 'update'), updateNote);

// Solo admin puede eliminar notas
router.delete('/:id', authenticateToken, validateRequest(idParamSchema, 'params'), authorizeRole('notes', 'delete'), deleteNote);

export default router;
