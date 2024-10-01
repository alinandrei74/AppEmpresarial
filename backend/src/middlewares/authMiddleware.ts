// Middlewares/authMiddleware.ts
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
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    Logger.error("JWT_SECRET is missing in the environment variables.");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Server configuration error: JWT_SECRET is missing",
      data: null,
    });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
    
      let errorMessage = "Invalid or expired token";
      if (err.name === "TokenExpiredError") {
        Logger.warning("JWT has expired");
        errorMessage = "Token has expired";
      } else if (err.name === "JsonWebTokenError") {
        Logger.warning("JWT is invalid");
        errorMessage = "Token is invalid";
      } else {
        Logger.error(`JWT verification failed: ${err.message}`);
      }
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: errorMessage,
        data: null,
      });
    }

    if (!decoded || typeof decoded !== "object" || !("user" in decoded)) {
      Logger.error("Invalid token payload: user information is missing");
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        message: "Invalid token payload: user information is missing",
        data: null,
      });
    }

    req.user = (decoded as TokenPayload).user;
    Logger.success(`Token verificado exitosamente para el usuario: ${req.user.username}`);
    next();
  });
};
