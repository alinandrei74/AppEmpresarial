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
  const user = req.user as User; // Asegúrate de que req.user sea de tipo User

  try {
    if (user.role === 'admin') {
      const work_schedules = await db.many("SELECT * FROM work_schedule");
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Horarios de trabajo recuperados exitosamente",
        data: work_schedules,
      });
    } else {
      const work_schedules = await db.many("SELECT * FROM work_schedule WHERE worker_id=$1", [user.id]);
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Horarios de trabajo recuperados exitosamente",
        data: work_schedules,
      });
    }
  } catch (error) {
    console.error("Error al recuperar los horarios de trabajo:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Error interno del servidor",
      data: null,
    });
  }
};

// Método para obtener el horario de trabajo por ID
export const getWorkScheduleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as User; // Asegúrate de que req.user sea de tipo User

  try {
    if (!id) {
      throw new WorkScheduleError("ID es requerido");
    }

    const work_schedule = await db.oneOrNone("SELECT * FROM work_schedule WHERE id=$1", [id]);
    if (work_schedule) {
      if (user.role === 'admin' || work_schedule.worker_id === user.id) {
        return res.status(StatusCodes.OK).json({
          status: StatusCodes.OK,
          message: `Horario de trabajo con ID ${id} recuperado exitosamente`,
          data: work_schedule,
        });
      } else {
        return res.status(StatusCodes.FORBIDDEN).json({
          status: StatusCodes.FORBIDDEN,
          message: "No tienes permiso para acceder a este horario",
          data: null,
        });
      }
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
  const { worker_id, start_time, end_time, description, day_of_week } = req.body;
  const user = req.user as User; // Asegúrate de que req.user sea de tipo User

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

    const result = await db.one(
      "INSERT INTO work_schedule (worker_id, start_time, end_time, description, day_of_week) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [worker_id, start_time, end_time, description, day_of_week]
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
    } else if (error && typeof error === "object" && "code" in error) {
      // Manejar error de clave foránea (ej. si worker_id no existe)
      if (error.code === "23503") {
        console.error("Error al crear el horario: trabajador no existe");
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: "El trabajador especificado no existe.",
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

// Método para actualizar un horario de trabajo por ID
export const updateWorkSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { worker_id, start_time, end_time, description, day_of_week } = req.body;
  const user = req.user as User; // Asegúrate de que req.user sea de tipo User

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

    const result = await db.result(
      "UPDATE work_schedule SET worker_id = $1, start_time = $2, end_time = $3, description = $4, day_of_week = $5 WHERE id = $6 RETURNING *",
      [worker_id, start_time, end_time, description, day_of_week, id]
    );

    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Horario de trabajo actualizado exitosamente",
        data: result.rows[0], // Devolver el horario actualizado
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Horario de trabajo no encontrado",
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
      // Manejar error de clave foránea (ej. si worker_id no existe)
      if (error.code === "23503") {
        console.error("Error al actualizar el horario: trabajador no existe");
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: "El trabajador especificado no existe.",
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

// Método para eliminar un horario de trabajo por ID
export const deleteWorkSchedule = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as User; // Asegúrate de que req.user sea de tipo User

  try {
    if (!id) {
      throw new WorkScheduleError("ID es requerido");
    }

    // Solo admin puede eliminar horarios
    if (user.role !== 'admin') {
      throw new WorkScheduleError("No tienes permiso para eliminar horarios.");
    }

    const result = await db.result("DELETE FROM work_schedule WHERE id = $1", [id]);

    if (result.rowCount) {
      return res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Horario de trabajo eliminado exitosamente",
        data: null,
      });
    } else {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: StatusCodes.NOT_FOUND,
        message: "Horario de trabajo no encontrado",
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
    } else if (error && typeof error === "object" && "code" in error) {
      // Manejar error de clave foránea si es necesario
      if (error.code === "23503") {
        console.error("Error al eliminar el horario: clave foránea");
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: "El horario de trabajo está asociado a otras entidades y no puede ser eliminado.",
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
