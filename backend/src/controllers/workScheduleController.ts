// src/controllers/workScheduleController.ts

import { Request, Response } from "express";
import { db } from "../config/db";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/user";
import { validateRequest } from "../middlewares/validateRequest";
import { workScheduleIdSchema, createWorkScheduleSchema, updateWorkScheduleSchema } from '../validators/validationSchemas';

class WorkScheduleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkScheduleError";
  }
}

export const getAllWorkSchedules = async (req: Request, res: Response) => {
  const user = req.user as User;

  try {
    const work_schedules = user.role === 'admin'
      ? await db.many("SELECT * FROM work_schedule")
      : await db.many("SELECT * FROM work_schedule WHERE worker_id=$1", [user.id]);

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Horarios de trabajo recuperados exitosamente",
      data: work_schedules,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Error interno del servidor",
      data: null,
    });
  }
};

export const getWorkScheduleById = [
  validateRequest(workScheduleIdSchema, 'params'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as User;

    try {
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
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Error interno del servidor",
        data: null,
      });
    }
  }
];

export const createWorkSchedule = [
  validateRequest(createWorkScheduleSchema),
  async (req: Request, res: Response) => {
    const { worker_id, start_time, end_time, description, day_of_week } = req.body;
    const user = req.user as User;

    try {
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
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: error.message,
          data: null,
        });
      } else if (error && typeof error === "object" && "code" in error && error.code === "23503") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: "El trabajador especificado no existe.",
        });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error interno del servidor",
          data: null,
        });
      }
    }
  }
];

export const updateWorkSchedule = [
  validateRequest(workScheduleIdSchema, 'params'),
  validateRequest(updateWorkScheduleSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { worker_id, start_time, end_time, description, day_of_week } = req.body;
    const user = req.user as User;

    try {
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
          data: result.rows[0],
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
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: error.message,
          data: null,
        });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error interno del servidor",
          data: null,
        });
      }
    }
  }
];

export const deleteWorkSchedule = [
  validateRequest(workScheduleIdSchema, 'params'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user as User;

    try {
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
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: StatusCodes.BAD_REQUEST,
          message: error.message,
          data: null,
        });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: StatusCodes.INTERNAL_SERVER_ERROR,
          message: "Error interno del servidor",
          data: null,
        });
      }
    }
  }
];
