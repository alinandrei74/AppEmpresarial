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
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getNotes = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
class NoteError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NoteError';
    }
}
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield db_1.db.any('SELECT * FROM notes');
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
});
exports.getNotes = getNotes;
const getNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const note = yield db_1.db.oneOrNone('SELECT * FROM notes WHERE id = $1', [id]);
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
});
exports.getNoteById = getNoteById;
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, user_id } = req.body; // Eliminamos name
    try {
        if (!title || !description || !user_id) {
            throw new NoteError('title, description, and user_id are required');
        }
        const result = yield db_1.db.one('INSERT INTO notes (title, description, user_id) VALUES ($1, $2, $3) RETURNING id', [title, description, user_id]);
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
});
exports.createNote = createNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description } = req.body; // Eliminamos name
    try {
        if (!title || !description) {
            throw new NoteError('title and description are required');
        }
        const result = yield db_1.db.result('UPDATE notes SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3', [title, description, id]);
        if (result.rowCount) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Note updated successfully',
                data: { id, title, description }, // Eliminamos name del response
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
});
exports.updateNote = updateNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_1.db.result('DELETE FROM notes WHERE id = $1', [id]);
        if (result.rowCount) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: 'Note deleted successfully',
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
        console.error('Error deleting note:', error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            data: null,
        });
    }
});
exports.deleteNote = deleteNote;
