import { Request, Response } from 'express';
import { db } from '../config/db';
import { StatusCodes } from 'http-status-codes';

class TaskError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TaskError';
  }
}

export const getTasks = async (req: Request, res: Response) => {

  try {
    const tasks = await db.any('SELECT * FROM tasks');
    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Tasks fetched successfully',
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      data: null,
    });
  }
};


/**
 *! Necesitaba `getCompletedTasksByUserId` o `getTasksById` pero no estaba y no hay tiempo.
 * Obtiene todas las tareas completadas por un usuario específico.
 * @param {Request} req - La solicitud de Express.
 * @param {Response} res - La respuesta de Express.
 * @returns {Promise<Response>} - La respuesta con el estado y los datos de las tareas.
 */
export const getCompletedTasksByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw new TaskError('User ID is required');
    }

    // Asegurarse de que userId sea un número
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      throw new TaskError('User ID must be a valid number');
    }

    // Obtener todas las tareas completadas por el usuario
    const tasks = await db.any(
      'SELECT * FROM tasks WHERE user_id = $1 AND status = $2',
      [parsedUserId, 'done']
    );

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Completed tasks fetched successfully',
      data: tasks,
    });
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      data: null,
    });
  }
};


export const createTask = async (req: Request, res: Response) => {
  const { description, status, user_id, created_at, title } = req.body;

  try {
    if (!description || !status || !user_id || !created_at || !title) {
      throw new TaskError('description, status, user_id, created_at, title are required');
    }

    // Asegúrate de que user_id sea un número
    const parsedUserId = parseInt(user_id, 10);
    if (isNaN(parsedUserId)) {
      throw new TaskError('user_id must be a valid number');
    }

    const result = await db.one(
      'INSERT INTO tasks (description, status, user_id, created_at, title) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [description, status, parsedUserId, created_at, title]
    );
    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: 'Task created successfully',
      data: { id: result.id },
    });
  } catch (error) {
    if (error instanceof TaskError) {
      console.error('Task creation error:', error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error('Error creating task:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        data: null,
      });
    }
  }
};


export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, status, user_id, created_at, title } = req.body;

  try {
    if (!id || !description || !status || !user_id || !created_at || !title) {
      throw new TaskError('ID, description, status, user_id, created_at and title are required');
    }

    // Asegurarse de que id y user_id sean números
    const parsedId = parseInt(id, 10);
    const parsedUserId = parseInt(user_id, 10);
    if (isNaN(parsedId) || isNaN(parsedUserId)) {
      throw new TaskError('ID and user_id must be valid numbers');
    }

    const completedAt = status === 'done' ? new Date() : null;

    const result = await db.result(
      'UPDATE tasks SET description = $1, status = $2, user_id = $3, created_at = $4, title = $5, completed_at = $6 WHERE id = $7 RETURNING *',
      [description, status, parsedUserId, created_at, title, completedAt, parsedId]
    );

    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Task updated successfully',
        data: result.rows[0], // Devolver la tarea actualizada
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: 'Task not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof TaskError) {
      console.error('Task update error:', error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error('Error updating task:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        data: null,
      });
    }
  }
};



export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new TaskError('ID is required');
    }

    // Asegurarse de que id sea un número
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new TaskError('ID must be a valid number');
    }

    const result = await db.result('DELETE FROM tasks WHERE id = $1', [parsedId]);
    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Task deleted successfully',
        data: null,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: 'Task not found',
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof TaskError) {
      console.error('Task deletion error:', error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error('Error deleting task:', error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        data: null,
      });
    }
  }
};

