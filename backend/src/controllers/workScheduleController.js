"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWorkSchedule = exports.deleteWorkSchedule = exports.createWorkSchedule = exports.getWorkScheduleById = exports.getAllWorkSchedules = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
class WorkScheduleError extends Error {
    constructor(message) {
        super(message);
        this.name = "WorkScheduleError";
    }
}
// Método para obtener todos los horarios de trabajo
const getAllWorkSchedules = async (req, res) => {
    const user = req.user;
    try {
        let work_schedules;
        // Los administradores pueden ver todos los horarios
        if (user.role === 'admin') {
            logger_1.default.information("Recuperando todos los horarios de trabajo para el administrador...");
            work_schedules = await db_1.db.any("SELECT * FROM work_schedule");
        }
        else {
            // Los usuarios normales solo ven sus propios horarios
            logger_1.default.information(`Recuperando horarios de trabajo para el usuario con ID: ${user.id}...`);
            work_schedules = await db_1.db.any("SELECT * FROM work_schedule WHERE user_id = $1", [user.id]);
        }
        logger_1.default.success("Horarios de trabajo recuperados exitosamente.");
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Horarios de trabajo recuperados exitosamente",
            data: work_schedules,
        });
    }
    catch (error) {
        logger_1.default.finalError("Error al recuperar los horarios de trabajo:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
};
exports.getAllWorkSchedules = getAllWorkSchedules;
// Método para obtener un horario de trabajo por ID (clave primaria) y user_id
const getWorkScheduleById = async (req, res) => {
    const { id } = req.params; // ID del horario (clave primaria)
    const user = req.user;
    try {
        if (!id) {
            throw new WorkScheduleError("ID es requerido");
        }
        logger_1.default.information(`Recuperando horario de trabajo con ID: ${id} para el usuario con rol ${user.role}...`);
        let work_schedule;
        if (user.role === 'admin') {
            // Los administradores pueden acceder a cualquier horario
            work_schedule = await db_1.db.oneOrNone("SELECT * FROM work_schedule WHERE id = $1", [id]);
        }
        else {
            // Usuarios normales solo pueden acceder a sus propios horarios
            work_schedule = await db_1.db.oneOrNone("SELECT * FROM work_schedule WHERE id = $1 AND user_id = $2", [id, user.id]);
        }
        if (work_schedule) {
            logger_1.default.success(`Horario de trabajo con ID ${id} recuperado exitosamente.`);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: `Horario de trabajo con ID ${id} recuperado exitosamente`,
                data: work_schedule,
            });
        }
        else {
            logger_1.default.warning(`Horario de trabajo con ID ${id} no encontrado.`);
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: `Horario de trabajo con ID ${id} no encontrado`,
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof WorkScheduleError) {
            logger_1.default.error(`Error al recuperar el horario de trabajo: ${error.message}`);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.finalError("Error interno al recuperar el horario de trabajo:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
};
exports.getWorkScheduleById = getWorkScheduleById;
// Método POST para crear una nueva entrada en el horario de trabajo
const createWorkSchedule = async (req, res) => {
    const { start_time, end_time, description, day_of_week } = req.body;
    const user = req.user;
    try {
        if (!start_time || !end_time || !description || !day_of_week) {
            throw new WorkScheduleError("Todos los campos son requeridos.");
        }
        // Validar que start_time sea menor que end_time
        if (new Date(start_time) >= new Date(end_time)) {
            throw new WorkScheduleError("La hora de inicio debe ser anterior a la hora de finalización.");
        }
        logger_1.default.information("Creando nuevo horario de trabajo...");
        // Insertar el horario con el user_id del usuario autenticado
        const result = await db_1.db.one("INSERT INTO work_schedule (user_id, start_time, end_time, description, day_of_week) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id", [user.id, start_time, end_time, description, day_of_week]);
        logger_1.default.success("Horario de trabajo creado exitosamente.");
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: "Horario de trabajo creado exitosamente",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof WorkScheduleError) {
            logger_1.default.error(`Error al crear el horario de trabajo: ${error.message}`);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.finalError("Error inesperado al crear el horario de trabajo:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
};
exports.createWorkSchedule = createWorkSchedule;
// Método para eliminar un horario de trabajo por ID (clave primaria) y user_id
const deleteWorkSchedule = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
        if (!id) {
            throw new WorkScheduleError("ID es requerido");
        }
        logger_1.default.information(`Eliminando horario de trabajo con ID: ${id}...`);
        // Solo los admins o el mismo usuario pueden eliminar el horario
        const result = await db_1.db.result("DELETE FROM work_schedule WHERE id = $1 AND user_id = $2", [id, user.id]);
        if (result.rowCount) {
            logger_1.default.success("Horario de trabajo eliminado exitosamente.");
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: "Horario de trabajo eliminado exitosamente",
                data: null,
            });
        }
        else {
            logger_1.default.warning("Horario de trabajo no encontrado o no tienes permiso para eliminarlo.");
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Horario de trabajo no encontrado o no tienes permiso para eliminarlo",
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof WorkScheduleError) {
            logger_1.default.error(`Error al eliminar el horario de trabajo: ${error.message}`);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            logger_1.default.finalError("Error inesperado al eliminar el horario de trabajo:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
};
exports.deleteWorkSchedule = deleteWorkSchedule;
// Método para actualizar un horario de trabajo por ID (clave primaria) y user_id
const updateWorkSchedule = async (req, res) => {
    const { id } = req.params; // ID del horario (clave primaria)
    const { start_time, end_time, description, day_of_week } = req.body;
    const user = req.user; // Información del usuario autenticado
    try {
        if (!id || !start_time || !end_time || !description || !day_of_week) {
            throw new WorkScheduleError("Todos los campos son requeridos.");
        }
        // Validar que start_time sea menor que end_time
        if (new Date(start_time) >= new Date(end_time)) {
            throw new WorkScheduleError("La hora de inicio debe ser anterior a la hora de finalización.");
        }
        logger_1.default.information(`Actualizando horario de trabajo con ID: ${id}...`);
        let result;
        // Verifica si es admin o si es el propietario del horario que intenta actualizar
        if (user.role === 'admin') {
            // Los administradores pueden actualizar cualquier horario
            result = await db_1.db.result("UPDATE work_schedule SET start_time = $1, end_time = $2, description = $3, day_of_week = $4 WHERE id = $5 RETURNING *", [start_time, end_time, description, day_of_week, id]);
        }
        else {
            // Los usuarios normales solo pueden actualizar sus propios horarios
            result = await db_1.db.result("UPDATE work_schedule SET start_time = $1, end_time = $2, description = $3, day_of_week = $4 WHERE id = $5 AND user_id = $6 RETURNING *", [start_time, end_time, description, day_of_week, id, user.id]);
        }
        if (result.rowCount) {
            logger_1.default.success("Horario de trabajo actualizado exitosamente.");
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: "Horario de trabajo actualizado exitosamente",
                data: result.rows[0], // Devolver el horario actualizado
            });
        }
        else {
            logger_1.default.warning("Horario de trabajo no encontrado o no tienes permiso para actualizarlo.");
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Horario de trabajo no encontrado o no tienes permiso para actualizarlo",
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof WorkScheduleError) {
            logger_1.default.error(`Error al actualizar el horario de trabajo: ${error.message}`);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else if (error && typeof error === "object" && "code" in error) {
            if (error.code === "23503") {
                logger_1.default.finalError("Error al actualizar el horario: usuario no existe.");
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "El usuario especificado no existe.",
                });
            }
            logger_1.default.finalError("Error inesperado:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
        else {
            logger_1.default.finalError("Error desconocido:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error desconocido",
                data: null,
            });
        }
    }
};
exports.updateWorkSchedule = updateWorkSchedule;
