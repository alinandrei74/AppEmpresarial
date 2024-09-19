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
exports.updateWorkSchedule = exports.deleteWorkSchedule = exports.createWorkSchedule = exports.getWorkScheduleById = exports.getAllWorkSchedules = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
class WorkScheduleError extends Error {
    constructor(message) {
        super(message);
        this.name = "WorkScheduleError";
    }
}
// Método para obtener todos los horarios de trabajo
const getAllWorkSchedules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        let work_schedules;
        // Los administradores pueden ver todos los horarios
        if (user.role === 'admin') {
            work_schedules = yield db_1.db.any("SELECT * FROM work_schedule");
        }
        else {
            // Los usuarios normales solo ven sus propios horarios
            work_schedules = yield db_1.db.any("SELECT * FROM work_schedule WHERE user_id = $1", [user.id]);
        }
        console.log(work_schedules);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Horarios de trabajo recuperados exitosamente",
            data: work_schedules,
        });
    }
    catch (error) {
        console.error("Error al recuperar los horarios de trabajo:", error);
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
});
exports.getAllWorkSchedules = getAllWorkSchedules;
// Método para obtener un horario de trabajo por ID (clave primaria) y user_id
const getWorkScheduleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // ID del horario (clave primaria)
    const user = req.user;
    try {
        if (!id) {
            throw new WorkScheduleError("ID es requerido");
        }
        let work_schedule;
        if (user.role === 'admin') {
            // Los administradores pueden acceder a cualquier horario
            work_schedule = yield db_1.db.oneOrNone("SELECT * FROM work_schedule WHERE id = $1", [id]);
        }
        else {
            // Usuarios normales solo pueden acceder a sus propios horarios
            work_schedule = yield db_1.db.oneOrNone("SELECT * FROM work_schedule WHERE id = $1 AND user_id = $2", [id, user.id]);
        }
        if (work_schedule) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: `Horario de trabajo con ID ${id} recuperado exitosamente`,
                data: work_schedule,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: `Horario de trabajo con ID ${id} no encontrado`,
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof WorkScheduleError) {
            console.error("Error al recuperar el horario de trabajo:", error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error("Error interno al recuperar el horario de trabajo:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
});
exports.getWorkScheduleById = getWorkScheduleById;
// Método POST para crear una nueva entrada en el horario de trabajo
const createWorkSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Insertar el horario con el user_id del usuario autenticado
        const result = yield db_1.db.one("INSERT INTO work_schedule (user_id, start_time, end_time, description, day_of_week) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id", [user.id, start_time, end_time, description, day_of_week]);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            status: http_status_codes_1.StatusCodes.CREATED,
            message: "Horario de trabajo creado exitosamente",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof WorkScheduleError) {
            console.error("Error al crear el horario de trabajo:", error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error("Error inesperado:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
});
exports.createWorkSchedule = createWorkSchedule;
// Método para eliminar un horario de trabajo por ID (clave primaria) y user_id
const deleteWorkSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user;
    try {
        if (!id) {
            throw new WorkScheduleError("ID es requerido");
        }
        // Solo los admins o el mismo usuario pueden eliminar el horario
        const result = yield db_1.db.result("DELETE FROM work_schedule WHERE id = $1 AND user_id = $2", [id, user.id]);
        if (result.rowCount) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: "Horario de trabajo eliminado exitosamente",
                data: null,
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Horario de trabajo no encontrado o no tienes permiso para eliminarlo",
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof WorkScheduleError) {
            console.error("Error al eliminar el horario de trabajo:", error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else {
            console.error("Error inesperado:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
});
exports.deleteWorkSchedule = deleteWorkSchedule;
// Método para actualizar un horario de trabajo por ID (clave primaria) y user_id
const updateWorkSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let result;
        // Verifica si es admin o si es el propietario del horario que intenta actualizar
        if (user.role === 'admin') {
            // Los administradores pueden actualizar cualquier horario
            result = yield db_1.db.result("UPDATE work_schedule SET start_time = $1, end_time = $2, description = $3, day_of_week = $4 WHERE id = $5 RETURNING *", [start_time, end_time, description, day_of_week, id]);
        }
        else {
            // Los usuarios normales solo pueden actualizar sus propios horarios
            result = yield db_1.db.result("UPDATE work_schedule SET start_time = $1, end_time = $2, description = $3, day_of_week = $4 WHERE id = $5 AND user_id = $6 RETURNING *", [start_time, end_time, description, day_of_week, id, user.id]);
        }
        if (result.rowCount) {
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: "Horario de trabajo actualizado exitosamente",
                data: result.rows[0], // Devolver el horario actualizado
            });
        }
        else {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                status: http_status_codes_1.StatusCodes.NOT_FOUND,
                message: "Horario de trabajo no encontrado o no tienes permiso para actualizarlo",
                data: null,
            });
        }
    }
    catch (error) {
        if (error instanceof WorkScheduleError) {
            console.error("Error al actualizar el horario de trabajo:", error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else if (error && typeof error === "object" && "code" in error) {
            if (error.code === "23503") {
                console.error("Error al actualizar el horario: usuario no existe");
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "El usuario especificado no existe.",
                });
            }
            console.error("Error inesperado:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
        else {
            console.error("Error desconocido:", error);
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error desconocido",
                data: null,
            });
        }
    }
});
exports.updateWorkSchedule = updateWorkSchedule;
