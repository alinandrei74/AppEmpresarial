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

export const createTask = async (req: Request, res: Response) => {
  const { description, status, user_id, created_at, title } = req.body;

  try {
    if (!description || !status || !user_id || !created_at || !title) {
      throw new TaskError('Description, status, user_id, created_at, title are required');
    }

    const result = await db.one(
      'INSERT INTO tasks (description, status, user_id, created_at, title) VALUES ($1, $2, $3, $4, $5) RETURNING task_id',
      [description, status, user_id, created_at, title]
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

    const result = await db.result(
      'UPDATE tasks SET description = $1, status = $2, user_id = $3, created_at = $4, title = $5 WHERE task_id = $6',
      [description, status, user_id, created_at, title, id]
    );
    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: 'Task updated successfully',
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

    const result = await db.result('DELETE FROM tasks WHERE task_id = $1', [id]);
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
