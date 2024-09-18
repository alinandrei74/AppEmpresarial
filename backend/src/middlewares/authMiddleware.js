"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            message: "No token provided or invalid token format",
            data: null,
        });
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET is missing in the environment variables.");
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Server configuration error: JWT_SECRET is missing",
            data: null,
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Asignar solo el usuario al objeto request
        req.user = decoded.user;
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
            status: http_status_codes_1.StatusCodes.FORBIDDEN,
            message: "Invalid or expired token",
            data: null,
        });
    }
};
exports.authenticateToken = authenticateToken;
