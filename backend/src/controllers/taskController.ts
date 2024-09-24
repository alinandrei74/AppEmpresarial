import { Request, Response } from 'express';
import { db } from '../config/db';
import { StatusCodes } from 'http-status-codes';
import Logger from '../utils/logger';
import { validateRequest } from '../middlewares/validateRequest';
import { createTaskSchema, updateTaskSchema, idParamSchema, userIdParamSchema } from '../validators/validationSchemas';

class TaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskError';
  }
}

// Obtener todas las tareas
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await db.any('SELECT * FROM tasks');
    Logger.success('Tareas obtenidas con éxito');
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Tareas obtenidas con éxito',
      data: tasks,
    });
  } catch (error) {
    Logger.error('Error al obtener tareas:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
      data: null,
    });
  }
};


export const getCompletedTasksByUserId = [
  validateRequest(userIdParamSchema, 'params'), 
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const tasks = await db.any('SELECT * FROM tasks WHERE user_id = $1 AND is_done = $2', [parseInt(userId), true]);
      Logger.success(`Tareas completadas para el usuario ${userId} obtenidas con éxito`);
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Tareas completadas obtenidas con éxito',
        data: tasks,
      });
    } catch (error) {
      Logger.error('Error al obtener tareas completadas:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        data: null,
      });
    }
  },
];

// Crear una nueva tarea
export const createTask = [
  validateRequest(createTaskSchema), 
  async (req: Request, res: Response) => {
    const { description, is_done = false, user_id, title } = req.body; // Valor predeterminado de is_done a false

    try {
      const result = await db.one(
        `INSERT INTO tasks (description, is_done, user_id, title) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [description, is_done, user_id, title]
      );

      Logger.success('Tarea creada con éxito');
      return res.status(StatusCodes.CREATED).json({
        status: StatusCodes.CREATED,
        message: 'Tarea creada con éxito',
        data: { id: result.id },
      });
    } catch (error) {
      Logger.error('Error al crear tarea:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        data: null,
      });
    }
  },
];


// Actualizar una tarea existente
export const updateTask = [
  validateRequest(updateTaskSchema, 'params'), // Validar cuerpo de la solicitud
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { description, is_done, user_id, title } = req.body;

    try {
      const result = await db.result(
        'UPDATE tasks SET description = $1, is_done = $2, user_id = $3, title = $4, completed_at = $5 WHERE id = $6 RETURNING *',
        [description, is_done, user_id, title, is_done === true ? new Date() : null, parseInt(id)]
      );

      if (result.rowCount) {
        Logger.success(`Tarea con ID ${id} actualizada con éxito`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: 'Tarea actualizada con éxito',
          data: result.rows[0],
        });
      } else {
        Logger.warning(`Tarea con ID ${id} no encontrada`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: 'Tarea no encontrada',
          data: null,
        });
      }
    } catch (error) {
      Logger.error('Error al actualizar tarea:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        data: null,
      });
    }
  },
];

// Eliminar una tarea
export const deleteTask = [
  validateRequest(idParamSchema, 'params'), // Validar ID en parámetros
  async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await db.result('DELETE FROM tasks WHERE id = $1', [parseInt(id)]);
      if (result.rowCount) {
        Logger.success(`Tarea con ID ${id} eliminada con éxito`);
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: 'Tarea eliminada con éxito',
          data: null,
        });
      } else {
        Logger.warning(`Tarea con ID ${id} no encontrada`);
        return res.status(StatusCodes.NOT_FOUND).json({
          status: StatusCodes.NOT_FOUND,
          message: 'Tarea no encontrada',
          data: null,
        });
      }
    } catch (error) {
      Logger.error('Error al eliminar tarea:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor',
        data: null,
      });
    }
  },
];
