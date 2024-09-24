"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getNoteById = exports.getNotes = void 0;
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../config/db");
const logger_1 = __importDefault(require("../utils/logger"));
const validateRequest_1 = require("../middlewares/validateRequest");
const validationSchemas_1 = require("../validators/validationSchemas");
const getNotes = async (req, res) => {
    try {
        const notes = await db_1.db.any(`
      SELECT notes.id, notes.title, notes.description, notes.user_id, notes.created_at, notes.updated_at, 
             users.name AS user_name, users.role AS user_role
      FROM notes
      JOIN users ON notes.user_id = users.id
    `);
        logger_1.default.success("Notas recuperadas con éxito.");
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Notas recuperadas exitosamente",
            data: notes,
        });
    }
    catch (error) {
        logger_1.default.finalError("Error al recuperar las notas:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
};
exports.getNotes = getNotes;
exports.getNoteById = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.idParamSchema, 'params'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const note = await db_1.db.oneOrNone("SELECT * FROM notes WHERE id = $1", [id]);
            if (note) {
                logger_1.default.success(`Nota con ID ${id} recuperada exitosamente.`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: "Nota recuperada exitosamente",
                    data: note,
                });
            }
            else {
                logger_1.default.warning(`Nota con ID ${id} no encontrada.`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Nota no encontrada",
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.finalError("Error al recuperar la nota por ID:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
];
exports.createNote = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.createNoteSchema),
    async (req, res) => {
        const { title, description, user_id } = req.body;
        try {
            const result = await db_1.db.one("INSERT INTO notes (title, description, user_id) VALUES ($1, $2, $3) RETURNING id", [title, description, user_id]);
            const userInfo = await db_1.db.one("SELECT name AS user_name, role AS user_role FROM users WHERE id = $1", [user_id]);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: http_status_codes_1.StatusCodes.CREATED,
                message: "Nota creada exitosamente",
                data: { id: result.id, title, description, user_id, user_role: userInfo.user_role, user_name: userInfo.user_name },
            });
        }
        catch (error) {
            logger_1.default.finalError("Error al crear la nota:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
];
exports.updateNote = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.idParamSchema, 'params'),
    (0, validateRequest_1.validateRequest)(validationSchemas_1.updateNoteSchema),
    async (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body;
        try {
            const result = await db_1.db.result("UPDATE notes SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3", [title, description, id]);
            if (result.rowCount) {
                logger_1.default.success(`Nota con ID ${id} actualizada exitosamente.`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: "Nota actualizada exitosamente",
                    data: null,
                });
            }
            else {
                logger_1.default.warning(`Nota con ID ${id} no encontrada.`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Nota no encontrada",
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.finalError("Error al actualizar la nota:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
];
exports.deleteNote = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.idParamSchema, 'params'),
    async (req, res) => {
        const { id } = req.params;
        try {
            const result = await db_1.db.result("DELETE FROM notes WHERE id = $1", [id]);
            if (result.rowCount) {
                logger_1.default.success(`Nota con ID ${id} eliminada exitosamente.`);
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: "Nota eliminada con éxito",
                    data: null,
                });
            }
            else {
                logger_1.default.warning(`Nota con ID ${id} no encontrada.`);
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Nota no encontrada",
                    data: null,
                });
            }
        }
        catch (error) {
            logger_1.default.finalError("Error al eliminar la nota:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
];
