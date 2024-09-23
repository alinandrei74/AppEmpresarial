import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../config/db';
import Logger from '../utils/logger';
import { validateRequest } from '../middlewares/validateRequest';
import { createNoteSchema, updateNoteSchema, idParamSchema } from '../validators/validationSchemas';

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await db.any(`
      SELECT notes.id, notes.title, notes.description, notes.user_id, notes.created_at, notes.updated_at, 
             users.name AS user_name, users.role AS user_role
      FROM notes
      JOIN users ON notes.user_id = users.id
    `);
    Logger.success("Notas recuperadas con éxito.");
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Notas recuperadas exitosamente",
      data: notes,
    });
  } catch (error) {
    Logger.finalError("Error al recuperar las notas:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Error interno del servidor",
      data: null,
    });
  }
};

export const getNoteById = [
  validateRequest(idParamSchema, 'params'), 
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const note = await db.oneOrNone("SELECT * FROM notes WHERE id = $1", [id]);
      if (note) {
        Logger.success(`Nota con ID ${id} recuperada exitosamente.`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: "Nota recuperada exitosamente",
          data: note,
        });
      } else {
        Logger.warning(`Nota con ID ${id} no encontrada.`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: "Nota no encontrada",
          data: null,
        });
      }
    } catch (error) {
      Logger.finalError("Error al recuperar la nota por ID:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
];

export const createNote = [
  validateRequest(createNoteSchema), 
  async (req: Request, res: Response) => {
    const { title, description, user_id } = req.body;

    try {
      const result = await db.one(
        "INSERT INTO notes (title, description, user_id) VALUES ($1, $2, $3) RETURNING id",
        [title, description, user_id]
      );

      const userInfo = await db.one(
        "SELECT name AS user_name, role AS user_role FROM users WHERE id = $1",
        [user_id]
      );

      return res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: "Nota creada exitosamente",
        data: { id: result.id, title, description, user_id, user_role: userInfo.user_role, user_name: userInfo.user_name },
      });
    } catch (error) {
      Logger.finalError("Error al crear la nota:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
];

export const updateNote = [
  validateRequest(idParamSchema, 'params'), 
  validateRequest(updateNoteSchema), 
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const result = await db.result(
        "UPDATE notes SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
        [title, description, id]
      );

      if (result.rowCount) {
        Logger.success(`Nota con ID ${id} actualizada exitosamente.`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: "Nota actualizada exitosamente",
          data: null,
        });
      } else {
        Logger.warning(`Nota con ID ${id} no encontrada.`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: "Nota no encontrada",
          data: null,
        });
      }
    } catch (error) {
      Logger.finalError("Error al actualizar la nota:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
];

export const deleteNote = [
  validateRequest(idParamSchema, 'params'), 
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await db.result("DELETE FROM notes WHERE id = $1", [id]);
      if (result.rowCount) {
        Logger.success(`Nota con ID ${id} eliminada exitosamente.`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: "Nota eliminada con éxito",
          data: null,
        });
      } else {
        Logger.warning(`Nota con ID ${id} no encontrada.`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: "Nota no encontrada",
          data: null,
        });
      }
    } catch (error) {
      Logger.finalError("Error al eliminar la nota:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
];
