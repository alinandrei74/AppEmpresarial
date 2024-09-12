import { Request, Response } from 'express';
import { db } from '../config/db';

// Obtener todas las tareas
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await db.any('SELECT * FROM tasks');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Crear nueva tarea
export const createTask = async (req: Request, res: Response) => {
  const { description, status, user_id, entry_date } = req.body;

  try {
    const result = await db.one(
      'INSERT INTO tasks (description, status, user_id, entry_date) VALUES ($1, $2, $3, $4) RETURNING task_id',
      [description, status, user_id, entry_date]
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Actualizar tarea
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, status, user_id, entry_date } = req.body;

  try {
    const result = await db.result(
      'UPDATE tasks SET description = $1, status = $2, user_id = $3, entry_date = $4 WHERE task_id = $5',
      [description, status, user_id, entry_date, id]
    );
    if (result.rowCount) {
      res.json({ message: 'Task updated' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Eliminar tarea
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.result('DELETE FROM tasks WHERE task_id = $1', [id]);
    if (result.rowCount) {
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
