import { Request, Response } from "express";
import { db } from "../config/db";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/user";

class WorkScheduleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkScheduleError";
  }
}

// Método para obtener todos los horarios de trabajo
export const getAllWorkSchedules = async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    let work_schedules;

    // Los administradores pueden ver todos los horarios
    if (user.role === 'admin') {
      work_schedules = await db.any("SELECT * FROM work_schedule");
    } else {
      // Los usuarios normales solo ven sus propios horarios
      work_schedules = await db.any("SELECT * FROM work_schedule WHERE user_id = $1", [user.id]);
    }

    console.log(work_schedules);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Horarios de trabajo recuperados exitosamente",
      data: work_schedules,
    });
  } catch (error) {
    console.error("Error al recuperar los horarios de trabajo:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Error interno del servidor",
      data: null,
    });
  }
};

// Método para obtener un horario de trabajo por ID (clave primaria) y user_id
export const getWorkScheduleById = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del horario (clave primaria)
  const user = req.user as User;

  try {
    if (!id) {
      throw new WorkScheduleError("ID es requerido");
    }

    let work_schedule;

    if (user.role === 'admin') {
      // Los administradores pueden acceder a cualquier horario
      work_schedule = await db.oneOrNone("SELECT * FROM work_schedule WHERE id = $1", [id]);
    } else {
      // Usuarios normales solo pueden acceder a sus propios horarios
      work_schedule = await db.oneOrNone("SELECT * FROM work_schedule WHERE id = $1 AND user_id = $2", [id, user.id]);
    }

    if (work_schedule) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: `Horario de trabajo con ID ${id} recuperado exitosamente`,
        data: work_schedule,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: `Horario de trabajo con ID ${id} no encontrado`,
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof WorkScheduleError) {
      console.error("Error al recuperar el horario de trabajo:", error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error("Error interno al recuperar el horario de trabajo:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
};

// Método POST para crear una nueva entrada en el horario de trabajo
export const createWorkSchedule = async (req: Request, res: Response) => {
  const { start_time, end_time, description, day_of_week } = req.body;
  const user = req.user as User;

  try {
    if (!start_time || !end_time || !description || !day_of_week) {
      throw new WorkScheduleError("Todos los campos son requeridos.");
    }

    // Validar que start_time sea menor que end_time
    if (new Date(start_time) >= new Date(end_time)) {
      throw new WorkScheduleError("La hora de inicio debe ser anterior a la hora de finalización.");
    }

    // Insertar el horario con el user_id del usuario autenticado
    const result = await db.one(
      "INSERT INTO work_schedule (user_id, start_time, end_time, description, day_of_week) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id",
      [user.id, start_time, end_time, description, day_of_week]
    );

    return res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      message: "Horario de trabajo creado exitosamente",
      data: result,
    });
  } catch (error) {
    if (error instanceof WorkScheduleError) {
      console.error("Error al crear el horario de trabajo:", error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error("Error inesperado:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
};

// Método para eliminar un horario de trabajo por ID (clave primaria) y user_id
export const deleteWorkSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as User;

  try {
    if (!id) {
      throw new WorkScheduleError("ID es requerido");
    }

    // Solo los admins o el mismo usuario pueden eliminar el horario
    const result = await db.result("DELETE FROM work_schedule WHERE id = $1 AND user_id = $2", [id, user.id]);

    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Horario de trabajo eliminado exitosamente",
        data: null,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Horario de trabajo no encontrado o no tienes permiso para eliminarlo",
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof WorkScheduleError) {
      console.error("Error al eliminar el horario de trabajo:", error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else {
      console.error("Error inesperado:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
};

// Método para actualizar un horario de trabajo por ID (clave primaria) y user_id
export const updateWorkSchedule = async (req: Request, res: Response) => {
  const { id } = req.params; // ID del horario (clave primaria)
  const { start_time, end_time, description, day_of_week } = req.body;
  const user = req.user as User; // Información del usuario autenticado

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
      result = await db.result(
        "UPDATE work_schedule SET start_time = $1, end_time = $2, description = $3, day_of_week = $4 WHERE id = $5 RETURNING *",
        [start_time, end_time, description, day_of_week, id]
      );
    } else {
      // Los usuarios normales solo pueden actualizar sus propios horarios
      result = await db.result(
        "UPDATE work_schedule SET start_time = $1, end_time = $2, description = $3, day_of_week = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
        [start_time, end_time, description, day_of_week, id, user.id]
      );
    }

    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Horario de trabajo actualizado exitosamente",
        data: result.rows[0], // Devolver el horario actualizado
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Horario de trabajo no encontrado o no tienes permiso para actualizarlo",
        data: null,
      });
    }
  } catch (error) {
    if (error instanceof WorkScheduleError) {
      console.error("Error al actualizar el horario de trabajo:", error.message);
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.message,
        data: null,
      });
    } else if (error && typeof error === "object" && "code" in error) {
      if (error.code === "23503") {
        console.error("Error al actualizar el horario: usuario no existe");
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: "El usuario especificado no existe.",
        });
      }
      console.error("Error inesperado:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    } else {
      console.error("Error desconocido:", error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error desconocido",
        data: null,
      });
    }
  }
};

