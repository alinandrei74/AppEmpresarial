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
exports.deleteWorkSchedule = exports.updateWorkSchedule = exports.createWorkSchedule = exports.getWorkScheduleById = exports.getAllWorkSchedules = void 0;
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
    const user = req.user; // Asegúrate de que req.user sea de tipo User
    try {
        if (user.role === 'admin') {
            const work_schedules = yield db_1.db.many("SELECT * FROM work_schedule");
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: "Horarios de trabajo recuperados exitosamente",
                data: work_schedules,
            });
        }
        else {
            const work_schedules = yield db_1.db.many("SELECT * FROM work_schedule WHERE worker_id=$1", [user.id]);
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                status: http_status_codes_1.StatusCodes.OK,
                message: "Horarios de trabajo recuperados exitosamente",
                data: work_schedules,
            });
        }
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
// Método para obtener el horario de trabajo por ID
const getWorkScheduleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user; // Asegúrate de que req.user sea de tipo User
    try {
        if (!id) {
            throw new WorkScheduleError("ID es requerido");
        }
        const work_schedule = yield db_1.db.oneOrNone("SELECT * FROM work_schedule WHERE id=$1", [id]);
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
    const { worker_id, start_time, end_time, description, day_of_week } = req.body;
    const user = req.user; // Asegúrate de que req.user sea de tipo User
    try {
        if (!worker_id || !start_time || !end_time || !description || !day_of_week) {
            throw new WorkScheduleError("Todos los campos son requeridos.");
        }
        // Validar que start_time sea menor que end_time
        if (new Date(start_time) >= new Date(end_time)) {
            throw new WorkScheduleError("La hora de inicio debe ser anterior a la hora de finalización.");
        }
        if (user.role !== 'admin' && user.id !== worker_id) {
            throw new WorkScheduleError("No tienes permiso para crear horarios para otros usuarios.");
        }
        const result = yield db_1.db.one("INSERT INTO work_schedule (worker_id, start_time, end_time, description, day_of_week) VALUES ($1, $2, $3, $4, $5) RETURNING *", [worker_id, start_time, end_time, description, day_of_week]);
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
        else if (error && typeof error === "object" && "code" in error) {
            // Manejar error de clave foránea (ej. si worker_id no existe)
            if (error.code === "23503") {
                console.error("Error al crear el horario: trabajador no existe");
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "El trabajador especificado no existe.",
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
exports.createWorkSchedule = createWorkSchedule;
// Método para actualizar un horario de trabajo por ID
const updateWorkSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { worker_id, start_time, end_time, description, day_of_week } = req.body;
    const user = req.user; // Asegúrate de que req.user sea de tipo User
    try {
        if (!id || !worker_id || !start_time || !end_time || !description || !day_of_week) {
            throw new WorkScheduleError("Todos los campos son requeridos.");
        }
        // Validar que start_time sea menor que end_time
        if (new Date(start_time) >= new Date(end_time)) {
            throw new WorkScheduleError("La hora de inicio debe ser anterior a la hora de finalización.");
        }
        // Solo admin puede actualizar horarios
        if (user.role !== 'admin') {
            throw new WorkScheduleError("No tienes permiso para actualizar horarios.");
        }
        const result = yield db_1.db.result("UPDATE work_schedule SET worker_id = $1, start_time = $2, end_time = $3, description = $4, day_of_week = $5 WHERE id = $6 RETURNING *", [worker_id, start_time, end_time, description, day_of_week, id]);
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
                message: "Horario de trabajo no encontrado",
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
            // Manejar error de clave foránea (ej. si worker_id no existe)
            if (error.code === "23503") {
                console.error("Error al actualizar el horario: trabajador no existe");
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "El trabajador especificado no existe.",
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
// Método para eliminar un horario de trabajo por ID
const deleteWorkSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.user; // Asegúrate de que req.user sea de tipo User
    try {
        if (!id) {
            throw new WorkScheduleError("ID es requerido");
        }
        // Solo admin puede eliminar horarios
        if (user.role !== 'admin') {
            throw new WorkScheduleError("No tienes permiso para eliminar horarios.");
        }
        const result = yield db_1.db.result("DELETE FROM work_schedule WHERE id = $1", [id]);
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
            console.error("Error al eliminar el horario de trabajo:", error.message);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                message: error.message,
                data: null,
            });
        }
        else if (error && typeof error === "object" && "code" in error) {
            // Manejar error de clave foránea si es necesario
            if (error.code === "23503") {
                console.error("Error al eliminar el horario: clave foránea");
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                    message: "El horario de trabajo está asociado a otras entidades y no puede ser eliminado.",
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
exports.deleteWorkSchedule = deleteWorkSchedule;
