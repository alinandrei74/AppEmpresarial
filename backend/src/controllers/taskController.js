"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getCompletedTasksByUserId = exports.getTasks = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const validateRequest_1 = require("../middlewares/validateRequest");
const validationSchemas_1 = require("../validators/validationSchemas");
class TaskError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TaskError';
    }
}
// Obtener todas las tareas
const getTasks = async (req, res) => {
    try {
        const tasks = await db_1.db.any('SELECT * FROM tasks');
        logger_1.default.success('Tareas obtenidas con éxito');
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Tareas obtenidas con éxito',
            data: tasks,
        });
    }
    catch (error) {
        logger_1.default.error('Error al obtener tareas:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            data: null,
        });
    }
};
exports.getTasks = getTasks;
exports.getCompletedTasksByUserId = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.userIdParamSchema, 'params'),
    async (req, res) => {
        const { userId } = req.params;
        try {
            const tasks = await db_1.db.any('SELECT * FROM tasks WHERE user_id = $1 AND status = $2', [parseInt(userId), 'completed']);
            logger_1.default.success(`Tareas completadas para el usuario ${userId} obtenidas con éxito`);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Tareas completadas obtenidas con éxito',
                data: tasks,
            });
        }
        catch (error) {
            logger_1.default.error('Error al obtener tareas completadas:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                data: null,
            });
        }
    },
];
// Crear una nueva tarea
exports.createTask = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.createTaskSchema),
    async (req, res) => {
        const { description, status, user_id, title } = req.body;
        try {
            const result = await db_1.db.one('INSERT INTO tasks (description, status, user_id, title) VALUES ($1, $2, $3, $4) RETURNING id', [description, status, user_id, title]);
            logger_1.default.success('Tarea creada con éxito');
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: http_status_codes_1.StatusCodes.CREATED,
                message: 'Tarea creada con éxito',
                data: { id: result.id },
            });
        }
        catch (error) {
            logger_1.default.error('Error al crear tarea:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                data: null,
            });
        }
    },
];
// Actualizar una tarea existente
exports.updateTask = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.updateTaskSchema, 'params'), // Validar cuerpo de la solicitud
    async (req, res) => {
        const { id } = req.params;
        const { description, status, user_id, title } = req.body;
        try {
            const result = await db_1.db.result('UPDATE tasks SET description = $1, status = $2, user_id = $3, title = $5, completed_at = $6 WHERE id = $7 RETURNING *', [description, status, user_id, title, status === 'completed' ? new Date() : null, parseInt(id)]);
            if (result.rowCount) {
                logger_1.default.success(`Tarea con ID ${id} actualizada con éxito`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: 'Tarea actualizada con éxito',
                    data: result.rows[0],
                });
            }
            else {
                logger_1.default.warning(`Tarea con ID ${id} no encontrada`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Tarea no encontrada',
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.error('Error al actualizar tarea:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                data: null,
            });
        }
    },
];
// Eliminar una tarea
exports.deleteTask = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.idParamSchema, 'params'), // Validar ID en parámetros
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await db_1.db.result('DELETE FROM tasks WHERE id = $1', [parseInt(id)]);
            if (result.rowCount) {
                logger_1.default.success(`Tarea con ID ${id} eliminada con éxito`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: 'Tarea eliminada con éxito',
                    data: null,
                });
            }
            else {
                logger_1.default.warning(`Tarea con ID ${id} no encontrada`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: 'Tarea no encontrada',
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.error('Error al eliminar tarea:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                data: null,
            });
        }
    },
];
