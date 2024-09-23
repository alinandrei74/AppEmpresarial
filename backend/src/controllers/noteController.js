"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getNotes = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
class NoteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoteError';
    }
}
const getNotes = async (req, res) => {
    try {
        const notes = await db_1.db.any('SELECT * FROM notes');
        logger_1.default.success('Notas recuperadas con éxito.');
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Notas recuperadas exitosamente',
            data: notes,
        });
    }
    catch (error) {
        logger_1.default.finalError('Error al recuperar las notas:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            data: null,
        });
    }
};
exports.getNotes = getNotes;
const getNoteById = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await db_1.db.oneOrNone('SELECT * FROM notes WHERE id = $1', [id]);
        if (note) {
            logger_1.default.success(`Nota con ID ${id} recuperada exitosamente.`);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Nota recuperada exitosamente',
                data: note,
            });
        }
        else {
            logger_1.default.warning(`Nota con ID ${id} no encontrada.`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Nota no encontrada',
                data: null,
            });
        }
    }
    catch (error) {
        logger_1.default.finalError('Error al recuperar la nota por ID:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            data: null,
        });
    }
};
exports.getNoteById = getNoteById;
const createNote = async (req, res) => {
    const { title, description, user_id } = req.body;
    try {
        // Validar que todos los campos requeridos están presentes
        if (!title || !description || !user_id) {
            throw new NoteError('El título, descripción y user_id son obligatorios');
        }
        // Modificar la consulta para insertar también el título
        const result = await db_1.db.one('INSERT INTO notes (title, description, user_id) VALUES ($1, $2, $3) RETURNING id', [title, description, user_id]);
        // Retornar la respuesta con los datos insertados
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: 'Nota creada exitosamente',
            data: { id: result.id, title, description, user_id },
        });
    }
    catch (error) {
        if (error instanceof NoteError) {
            logger_1.default.warning('Error de validación al crear la nota:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.finalError('Error al crear la nota:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                data: null,
            });
        }
    }
};
exports.createNote = createNote;
const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body; // Eliminamos name
    try {
        if (!description) {
            throw new NoteError('La descripción es obligatoria');
        }
        const result = await db_1.db.result('UPDATE notes SET description = $1 WHERE id = $2', [description, id]);
        if (result.rowCount) {
            logger_1.default.success(`Nota con ID ${id} actualizada exitosamente.`);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Nota actualizada exitosamente',
                data: null,
            });
        }
        else {
            logger_1.default.warning(`Nota con ID ${id} no encontrada.`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Nota no encontrada',
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof NoteError) {
            logger_1.default.warning('Error de validación al actualizar la nota:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.finalError('Error al actualizar la nota:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Error interno del servidor',
                data: null,
            });
        }
    }
};
exports.updateNote = updateNote;
const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db_1.db.result('DELETE FROM notes WHERE id = $1', [id]);
        if (result.rowCount) {
            logger_1.default.success(`Nota con ID ${id} eliminada exitosamente.`);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Nota eliminada con éxito',
                data: null,
            });
        }
        else {
            logger_1.default.warning(`Nota con ID ${id} no encontrada.`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Nota no encontrada',
                data: null,
            });
        }
    }
    catch (error) {
        logger_1.default.finalError('Error al eliminar la nota:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            data: null,
        });
    }
};
exports.deleteNote = deleteNote;
