"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getNotes = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
class NoteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoteError';
    }
}
const getNotes = async (req, res) => {
    try {
        const notes = await db_1.db.any('SELECT * FROM notes');
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: 'Notes fetched successfully',
            data: notes,
        });
    }
    catch (error) {
        console.error('Error fetching notes:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
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
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Note fetched successfully',
                data: note,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Note not found',
                data: null,
            });
        }
    }
    catch (error) {
        console.error('Error fetching note by ID:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
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
            throw new NoteError('title, description, and user_id are required');
        }
        // Modificar la consulta para insertar también el título
        const result = await db_1.db.one('INSERT INTO notes (title, description, user_id) VALUES ($1, $2, $3) RETURNING id', [title, description, user_id]);
        // Retornar la respuesta con los datos insertados
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: 'Note created successfully',
            data: { id: result.id, title, description, user_id },
        });
    }
    catch (error) {
        if (error instanceof NoteError) {
            console.error('Note creation error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error('Error creating note:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                data: null,
            });
        }
    }
};
exports.createNote = createNote;
const updateNote = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        if (!description) {
            throw new NoteError('description is required');
        }
        const result = await db_1.db.result('UPDATE notes SET description = $1 WHERE id = $2', [description, id]);
        if (result.rowCount) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Note updated successfully',
                data: null,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Note not found',
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof NoteError) {
            console.error('Note update error:', error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error('Error updating note:', error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
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
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Nota eliminada con éxito',
                data: null,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: 'Nota no encontrada',
                data: null,
            });
        }
    }
    catch (error) {
        console.error('Error eliminando la nota:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Error interno del servidor',
            data: null,
        });
    }
};
exports.deleteNote = deleteNote;
