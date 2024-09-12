import { Request, Response } from 'express';
import { db } from '../config/db';

// Obtener todas las notas
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await db.any('SELECT * FROM notes');
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Obtener una nota por ID
export const getNoteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const note = await db.oneOrNone('SELECT * FROM notes WHERE id = $1', [id]);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Crear una nueva nota
export const createNote = async (req: Request, res: Response) => {
  const { content, userId } = req.body;

  try {
    const result = await db.one(
      'INSERT INTO notes (content, user_id) VALUES ($1, $2) RETURNING id',
      [content, userId]
    );
    res.status(201).json({ id: result.id, content, userId });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Actualizar una nota existente
export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const result = await db.result(
      'UPDATE notes SET content = $1 WHERE id = $2',
      [content, id]
    );
    if (result.rowCount) {
      res.json({ message: 'Note updated' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Eliminar una nota
export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.result('DELETE FROM notes WHERE id = $1', [id]);
    if (result.rowCount) {
      res.json({ message: 'Note deleted' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
