"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const db_1 = require("../config/db");
// Clase de error personalizada para el manejo de tareas
class TaskError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TaskError';
    }
}
// Obtener todas las tareas
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield db_1.db.any('SELECT * FROM tasks');
        res.json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getTasks = getTasks;
// Crear nueva tarea
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, status, user_id, entry_date } = req.body;
    try {
        // Verificar que todos los campos obligatorios estén presentes
        if (!description || !status || !user_id || !entry_date) {
            throw new TaskError('Description, status, user_id, and entry_date are required');
        }
        const result = yield db_1.db.one('INSERT INTO tasks (description, status, user_id, entry_date) VALUES ($1, $2, $3, $4) RETURNING task_id', [description, status, user_id, entry_date]);
        res.status(201).json({ task_id: result.task_id });
    }
    catch (error) {
        if (error instanceof TaskError) {
            console.error('Task creation error:', error.message);
            res.status(400).json({ message: error.message }); // Errores de validación específicos
        }
        else {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.createTask = createTask;
// Actualizar tarea
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, status, user_id, entry_date } = req.body;
    try {
        // Verificar que el ID y los campos obligatorios estén presentes
        if (!id || !description || !status || !user_id || !entry_date) {
            throw new TaskError('ID, description, status, user_id, and entry_date are required');
        }
        const result = yield db_1.db.result('UPDATE tasks SET description = $1, status = $2, user_id = $3, entry_date = $4 WHERE task_id = $5', [description, status, user_id, entry_date, id]);
        if (result.rowCount) {
            res.json({ message: 'Task updated' });
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        if (error instanceof TaskError) {
            console.error('Task update error:', error.message);
            res.status(400).json({ message: error.message }); // Errores de validación específicos
        }
        else {
            console.error('Error updating task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.updateTask = updateTask;
// Eliminar tarea
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            throw new TaskError('ID is required');
        }
        const result = yield db_1.db.result('DELETE FROM tasks WHERE task_id = $1', [id]);
        if (result.rowCount) {
            res.json({ message: 'Task deleted' });
        }
        else {
            res.status(404).json({ message: 'Task not found' });
        }
    }
    catch (error) {
        if (error instanceof TaskError) {
            console.error('Task deletion error:', error.message);
            res.status(400).json({ message: error.message }); // Errores de validación específicos
        }
        else {
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
exports.deleteTask = deleteTask;
