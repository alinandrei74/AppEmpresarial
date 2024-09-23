"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getCompletedTasksByUserId = exports.getTasks = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
class TaskError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TaskError';
    }
}
const getTasks = async (req, res) => {
    try {
        const tasks = await db_1.db.any('SELECT * FROM tasks');
        logger_1.default.success('Tasks fetched successfully');
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Tasks fetched successfully',
            data: tasks,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching tasks:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.getTasks = getTasks;
/**
 *! Necesitaba `getCompletedTasksByUserId` o `getTasksById` pero no estaba y no hay tiempo.
 * Obtiene todas las tareas completadas por un usuario específico.
 * @param {Request} req - La solicitud de Express.
 * @param {Response} res - La respuesta de Express.
 * @returns {Promise<Response>} - La respuesta con el estado y los datos de las tareas.
 */
const getCompletedTasksByUserId = async (req, res) => {
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
        const tasks = await db_1.db.any('SELECT * FROM tasks WHERE user_id = $1 AND status = $2', [parsedUserId, 'done']);
        logger_1.default.success(`Completed tasks for user ${parsedUserId} fetched successfully`);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Completed tasks fetched successfully',
            data: tasks,
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching completed tasks:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            data: null,
        });
    }
};
exports.getCompletedTasksByUserId = getCompletedTasksByUserId;
const createTask = async (req, res) => {
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
        const result = await db_1.db.one('INSERT INTO tasks (description, status, user_id, created_at, title) VALUES ($1, $2, $3, $4, $5) RETURNING id', [description, status, parsedUserId, created_at, title]);
        logger_1.default.finalSuccess('Task created successfully');
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: 'Task created successfully',
            data: { id: result.id },
        });
    }
    catch (error) {
        if (error instanceof TaskError) {
            logger_1.default.error('Task creation error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.finalError('Error creating task:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                data: null,
            });
        }
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
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
        const result = await db_1.db.result('UPDATE tasks SET description = $1, status = $2, user_id = $3, created_at = $4, title = $5, completed_at = $6 WHERE id = $7 RETURNING *', [description, status, parsedUserId, created_at, title, completedAt, parsedId]);
        if (result.rowCount) {
            logger_1.default.success(`Task with ID ${parsedId} updated successfully`);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Task updated successfully',
                data: result.rows[0],
            });
        }
        else {
            logger_1.default.warning(`Task with ID ${parsedId} not found`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Task not found',
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof TaskError) {
            logger_1.default.error('Task update error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.finalError('Error updating task:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                data: null,
            });
        }
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
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
        const result = await db_1.db.result('DELETE FROM tasks WHERE id = $1', [parsedId]);
        if (result.rowCount) {
            logger_1.default.success(`Task with ID ${parsedId} deleted successfully`);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Task deleted successfully',
                data: null,
            });
        }
        else {
            logger_1.default.warning(`Task with ID ${parsedId} not found`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Task not found',
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof TaskError) {
            logger_1.default.error('Task deletion error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.finalError('Error deleting task:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                data: null,
            });
        }
    }
};
exports.deleteTask = deleteTask;
