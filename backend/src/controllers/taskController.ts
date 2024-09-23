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

// Obtener tareas completadas por un usuario específico
export const getCompletedTasksByUserId = [
  validateRequest(userIdParamSchema, 'params'), // Validar userId en los parámetros
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const tasks = await db.any('SELECT * FROM tasks WHERE user_id = $1 AND status = $2', [parseInt(userId), 'completed']);
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
  validateRequest(createTaskSchema), // Validar cuerpo de la solicitud
  async (req: Request, res: Response) => {
    const { description, status, user_id, created_at, title } = req.body;

    try {
      const result = await db.one(
        'INSERT INTO tasks (description, status, user_id, created_at, title) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [description, status, user_id, created_at, title]
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
    const { description, status, user_id, created_at, title } = req.body;

    try {
      const result = await db.result(
        'UPDATE tasks SET description = $1, status = $2, user_id = $3, created_at = $4, title = $5, completed_at = $6 WHERE id = $7 RETURNING *',
        [description, status, user_id, created_at, title, status === 'completed' ? new Date() : null, parseInt(id)]
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
