import { Router } from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/noteController';
import { authorizeRole } from '../middlewares/authRole';

const router = Router();

// Permitir lectura de notas a roles autorizados
router.get('/', authorizeRole('notes', 'read'), getNotes);
router.get('/:id', authorizeRole('notes', 'read'), getNoteById);

// Solo roles con permisos para crear notas
router.post('/', authorizeRole('notes', 'create'), createNote);

// Permitir actualización de notas
router.put('/:id', authorizeRole('notes', 'update'), updateNote);

// Solo admin puede eliminar notas
router.delete('/:id', authorizeRole('notes', 'delete'), deleteNote);

export default router;
