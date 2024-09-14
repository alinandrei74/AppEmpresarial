import { Request, Response } from 'express';
import { db } from '../config/db';

// Clase de error personalizada para el manejo de tareas
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
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Crear nueva tarea
export const createTask = async (req: Request, res: Response) => {
  const { description, status, user_id, created_at, title  } = req.body;

  try {
    // Verificar que todos los campos obligatorios estén presentes
    if (!description || !status || !user_id || !created_at || !title) {
      throw new TaskError('Description, status, user_id, created_at, title are required');
    }

    const result = await db.one(
      'INSERT INTO tasks (description, status, user_id, created_at, title) VALUES ($1, $2, $3, $4, $5) RETURNING task_id',
      [description, status, user_id, created_at, title]
    );
    res.status(201).json({ task_id: result.task_id });
  } catch (error) {
    if (error instanceof TaskError) {
      console.error('Task creation error:', error.message);
      res.status(400).json({ message: error.message });
    } else {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Actualizar tarea
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, status, user_id, created_at, title } = req.body;

  try {
    // Verificar que el ID y los campos obligatorios estén presentes
    if (!id || !description || !status || !user_id || !created_at || !title) {
      throw new TaskError('ID, description, status, user_id, created_at and title are required');
    }

    const result = await db.result(
      'UPDATE tasks SET description = $1, status = $2, user_id = $3, created_at = $4 WHERE task_id = $5, title = $6',
      [description, status, user_id, created_at, id, title]
    );
    if (result.rowCount) {
      res.json({ message: 'Task updated' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    if (error instanceof TaskError) {
      console.error('Task update error:', error.message);
      res.status(400).json({ message: error.message }); 
    } else {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

// Eliminar tarea
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new TaskError('ID is required');
    }

    const result = await db.result('DELETE FROM tasks WHERE task_id = $1', [id]);
    if (result.rowCount) {
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    if (error instanceof TaskError) {
      console.error('Task deletion error:', error.message);
      res.status(400).json({ message: error.message }); // Errores de validación específicos
    } else {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
