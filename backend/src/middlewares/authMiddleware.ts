import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User } from "../types/user";
import Logger from '../utils/logger';

interface TokenPayload {
  user: User;
  iat: number;
  exp: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    Logger.warning("No token provided or invalid token format");
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: StatusCodes.UNAUTHORIZED,
      message: "No token provided or invalid token format",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    Logger.error("JWT_SECRET is missing in the environment variables.");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server configuration error: JWT_SECRET is missing",
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;

    // Asignar el usuario al objeto request
    req.user = decoded.user;
    Logger.success(`Token verificado exitosamente para el usuario: ${req.user.username}`);
    next();
  } catch (err) {
    Logger.error(`JWT verification failed: ${err}`);
    return res.status(StatusCodes.FORBIDDEN).json({
      status: StatusCodes.FORBIDDEN,
      message: "Invalid or expired token",
      data: null,
    });
  }
};
