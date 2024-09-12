import { Router } from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} from '../controllers/noteController';

const router = Router();

// Rutas para las notas
router.get('/', getNotes); 
router.get('/:id', getNoteById); 
router.post('/', createNote); 
router.put('/:id', updateNote); 
router.delete('/:id', deleteNote); 

export default router;
