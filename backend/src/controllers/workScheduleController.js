"use strict";
// src/controllers/workScheduleController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkSchedule = exports.updateWorkSchedule = exports.createWorkSchedule = exports.getWorkScheduleById = exports.getAllWorkSchedules = void 0;
const db_1 = require("../config/db");
const http_status_codes_1 = require("http-status-codes");
const validateRequest_1 = require("../middlewares/validateRequest");
const validationSchemas_1 = require("../validators/validationSchemas");
class WorkScheduleError extends Error {
    constructor(message) {
        super(message);
        this.name = "WorkScheduleError";
    }
}
const getAllWorkSchedules = async (req, res) => {
    const user = req.user;
    try {
        const work_schedules = user.role === 'admin'
            ? await db_1.db.many("SELECT * FROM work_schedule")
            : await db_1.db.many("SELECT * FROM work_schedule WHERE worker_id=$1", [user.id]);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Horarios de trabajo recuperados exitosamente",
            data: work_schedules,
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error interno del servidor",
            data: null,
        });
    }
};
exports.getAllWorkSchedules = getAllWorkSchedules;
exports.getWorkScheduleById = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.workScheduleIdSchema, 'params'),
    async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        try {
            const work_schedule = await db_1.db.oneOrNone("SELECT * FROM work_schedule WHERE id=$1", [id]);
            if (work_schedule) {
                if (user.role === 'admin' || work_schedule.worker_id === user.id) {
                    return res.status(http_status_codes_1.StatusCodes.OK).json({
                        status: http_status_codes_1.StatusCodes.OK,
                        message: `Horario de trabajo con ID ${id} recuperado exitosamente`,
                        data: work_schedule,
                    });
                }
                else {
                    return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                        status: http_status_codes_1.StatusCodes.FORBIDDEN,
                        message: "No tienes permiso para acceder a este horario",
                        data: null,
                    });
                }
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
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error interno del servidor",
                data: null,
            });
        }
    }
];
exports.createWorkSchedule = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.createWorkScheduleSchema),
    async (req, res) => {
        const { worker_id, start_time, end_time, description, day_of_week } = req.body;
        const user = req.user;
        try {
            if (user.role !== 'admin' && user.id !== worker_id) {
                throw new WorkScheduleError("No tienes permiso para crear horarios para otros usuarios.");
            }
            const result = await db_1.db.one("INSERT INTO work_schedule (worker_id, start_time, end_time, description, day_of_week) VALUES ($1, $2, $3, $4, $5) RETURNING *", [worker_id, start_time, end_time, description, day_of_week]);
            return res.status(http_status_codes_1.StatusCodes.CREATED).json({
                status: http_status_codes_1.StatusCodes.CREATED,
                message: "Horario de trabajo creado exitosamente",
                data: result,
            });
        }
        catch (error) {
            if (error instanceof WorkScheduleError) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            else if (error && typeof error === "object" && "code" in error && error.code === "23503") {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "El trabajador especificado no existe.",
                });
            }
            else {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Error interno del servidor",
                    data: null,
                });
            }
        }
    }
];
exports.updateWorkSchedule = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.workScheduleIdSchema, 'params'),
    (0, validateRequest_1.validateRequest)(validationSchemas_1.updateWorkScheduleSchema),
    async (req, res) => {
        const { id } = req.params;
        const { worker_id, start_time, end_time, description, day_of_week } = req.body;
        const user = req.user;
        try {
            if (user.role !== 'admin') {
                throw new WorkScheduleError("No tienes permiso para actualizar horarios.");
            }
            const result = await db_1.db.result("UPDATE work_schedule SET worker_id = $1, start_time = $2, end_time = $3, description = $4, day_of_week = $5 WHERE id = $6 RETURNING *", [worker_id, start_time, end_time, description, day_of_week, id]);
            if (result.rowCount) {
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    status: http_status_codes_1.StatusCodes.OK,
                    message: "Horario de trabajo actualizado exitosamente",
                    data: result.rows[0],
                });
            }
            else {
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    status: http_status_codes_1.StatusCodes.NOT_FOUND,
                    message: "Horario de trabajo no encontrado",
                    data: null,
                });
            }
        }
        catch (error) {
            if (error instanceof WorkScheduleError) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            else {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Error interno del servidor",
                    data: null,
                });
            }
        }
    }
];
exports.deleteWorkSchedule = [
    (0, validateRequest_1.validateRequest)(validationSchemas_1.workScheduleIdSchema, 'params'),
    async (req, res) => {
        const { id } = req.params;
        const user = req.user;
        try {
            if (user.role !== 'admin') {
                throw new WorkScheduleError("No tienes permiso para eliminar horarios.");
            }
            const result = await db_1.db.result("DELETE FROM work_schedule WHERE id = $1", [id]);
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
                    message: "Horario de trabajo no encontrado",
                    data: null,
                });
            }
        }
        catch (error) {
            if (error instanceof WorkScheduleError) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: error.message,
                    data: null,
                });
            }
            else {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
                    message: "Error interno del servidor",
                    data: null,
                });
            }
        }
    }
];
