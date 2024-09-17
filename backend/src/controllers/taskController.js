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
const http_status_codes_1 = require("http-status-codes");
class TaskError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TaskError';
    }
}
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield db_1.db.any('SELECT * FROM tasks');
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Tasks fetched successfully',
            data: tasks,
        });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            data: null,
        });
    }
});
exports.getTasks = getTasks;
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, status, user_id, created_at, title } = req.body;
    try {
        if (!description || !status || !user_id || !created_at || !title) {
            throw new TaskError('description, status, user_id, created_at, title are required');
        }
        const result = yield db_1.db.one('INSERT INTO tasks (description, status, user_id, created_at, title) VALUES ($1, $2, $3, $4, $5) RETURNING id', [description, status, user_id, created_at, title]);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: 'Task created successfully',
            data: { id: result.id },
        });
    }
    catch (error) {
        if (error instanceof TaskError) {
            console.error('Task creation error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error('Error creating task:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                data: null,
            });
        }
    }
});
exports.createTask = createTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, status, user_id, created_at, title } = req.body;
    try {
        if (!id || !description || !status || !user_id || !created_at || !title) {
            throw new TaskError('ID, description, status, user_id, created_at and title are required');
        }
        const result = yield db_1.db.result('UPDATE tasks SET description = $1, status = $2, user_id = $3, created_at = $4, title = $5 WHERE id = $6', [description, status, user_id, created_at, title, id]);
        if (result.rowCount) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Task updated successfully',
                data: null,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Task not found',
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof TaskError) {
            console.error('Task update error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error('Error updating task:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                data: null,
            });
        }
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            throw new TaskError('ID is required');
        }
        const result = yield db_1.db.result('DELETE FROM tasks WHERE id = $1', [id]);
        if (result.rowCount) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Task deleted successfully',
                data: null,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Task not found',
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof TaskError) {
            console.error('Task deletion error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error('Error deleting task:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                data: null,
            });
        }
    }
});
exports.deleteTask = deleteTask;
