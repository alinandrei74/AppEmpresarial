"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../utils/logger"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger_1.default.warning("No token provided or invalid token format");
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: "No token provided or invalid token format",
            data: null,
        });
    }
    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        logger_1.default.error("JWT_SECRET is missing in the environment variables.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server configuration error: JWT_SECRET is missing",
            data: null,
        });
    }
    jsonwebtoken_1.default.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            let errorMessage = "Invalid or expired token";
            if (err.name === "TokenExpiredError") {
                logger_1.default.warning("JWT has expired");
                errorMessage = "Token has expired";
            }
            else if (err.name === "JsonWebTokenError") {
                logger_1.default.warning("JWT is invalid");
                errorMessage = "Token is invalid";
            }
            else {
                logger_1.default.error(`JWT verification failed: ${err.message}`);
            }
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: errorMessage,
                data: null,
            });
        }
        if (!decoded || typeof decoded !== "object" || !("user" in decoded)) {
            logger_1.default.error("Invalid token payload: user information is missing");
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
                status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
                message: "Invalid token payload: user information is missing",
                data: null,
            });
        }
        req.user = decoded.user;
        logger_1.default.success(`Token verificado exitosamente para el usuario: ${req.user.username}`);
        next();
    });
};
exports.authenticateToken = authenticateToken;
