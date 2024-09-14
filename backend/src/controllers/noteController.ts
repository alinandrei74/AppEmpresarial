import { Request, Response } from 'express';
import { db } from '../config/db';
import { StatusCodes } from 'http-status-codes';

class NoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoteError';
  }
}

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await db.any('SELECT * FROM notes');
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Notes fetched successfully',
      data: notes,
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const note = await db.oneOrNone('SELECT * FROM notes WHERE id = $1', [id]);
    if (note) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Note fetched successfully',
        data: note,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: 'Note not found',
        data: null,
      });
    }
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      data: null,
    });
  }
};

export const createNote = async (req: Request, res: Response) => {
  const { description, user_id } = req.body;

  try {
    if (!description || !user_id) {
      throw new NoteError('description and user_id are required');
    }

    const result = await db.one(
      'INSERT INTO notes (description, user_id) VALUES ($1, $2) RETURNING id',
      [description, user_id]
    );
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: 'Note created successfully',
      data: { id: result.id, description, user_id },
    });
  } catch (error) {
    if (error instanceof NoteError) {
      console.error('Note creation error:', error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error('Error creating note:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        data: null,
      });
    }
  }
};

export const updateNote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description } = req.body;

  try {
    if (!description) {
      throw new NoteError('description is required');
    }

    const result = await db.result(
      'UPDATE notes SET description = $1 WHERE id = $2',
      [description, id]
    );
    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Note updated successfully',
        data: null,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: 'Note not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof NoteError) {
      console.error('Note update error:', error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error('Error updating note:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        data: null,
      });
    }
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.result('DELETE FROM notes WHERE id = $1', [id]);
    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Note deleted successfully',
        data: null,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: 'Note not found',
        data: null,
      });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      data: null,
    });
  }
};
